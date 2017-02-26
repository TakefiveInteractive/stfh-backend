import * as socketio from 'socket.io';
import redis from './database';
import * as uuidV4 from 'uuid/v4';
import * as formatter from './formatter';
import {cursorTo} from "readline";

const sockio = socketio();

const sockets = {};

type Point = [number, number];

(async function() {
  const db = <any> await redis;

  const sendToClientsInRoom = async (roomId, eventname, payload?) => {
    const roomKey = formatter.formatRoomViewersListKey(roomId);
    const viewersList = await db.smembersAsync(roomKey);
    viewersList.forEach(viewerId => Object.keys(sockets[roomId]).forEach(id => {
      if (sockets[roomId][id].type === 'viewer') {
        sockets[roomId][id].emit(eventname, payload);
      }
    }));
  };

  sockio.on('connection', sock => {

    const userId = uuidV4();

    /**
     * Broadcaster create room
     *
     * room:create : { roomName, broadcasterName }
     *
     * Return with { roomId, userId }
     */
    sock.on('room:create', ({roomName, broadcasterName}, ack) => {
      const roomId = roomName;
      const key = formatter.formatRoomKey(roomId);

      db.hmsetAsync(key, {roomId, roomName})
        .then(() => {
          const broadcasterKey = formatter.formatRoomBroadcasterKey(roomId);
          return db.hmsetAsync(broadcasterKey, {
            id: userId,
            nickname: broadcasterName,
            createTime: new Date()
          })
        })
        .then(() => {
          sockets[roomId] = {};
          sockets[roomId][userId] = {socket: sock, type: 'broadcaster'};
        })
        .then(() => ack({roomId, userId}));
    });

    /**
     * Delete room. Only broadcaster can do this
     *
     * room:delete : { roomId, broadcasterId }
     *
     * Return with null if ok.
     *  { error } if failed
     */
    sock.on('room:delete', ({ roomId, broadcasterId }, ack) => {
      const roomKey = formatter.formatRoomKey(roomId);
      const broadcasterKey = formatter.formatRoomBroadcasterKey(userId);

      if (broadcasterId !== userId) {
        return ack({ error: 'broadcasterId mismatch' });
      }
      db.hdelAsync(broadcasterKey)
        .then(() => db.hdelAsync(roomKey))
        .then(() => delete sockets[roomId])
        .then(() => ack(null));
    });

    /**
     * Viewer connect to room
     *
     * viewer:connect : { nickname, roomId }
     *
     * Return with { userId }
     */
    sock.on('viewer:connect', ({roomId, nickname}, ack) => {
      const viewerKey = formatter.formatRoomViewerKey(roomId, userId);
      const viewersListKey = formatter.formatRoomViewersListKey(roomId);

      db.hmsetAsync(viewerKey, {userId, nickname, createTime: new Date()})
        .then(() => db.saddAsync(viewersListKey, userId))
        .then(() => sockets[roomId][userId] = {socket: sock, type: 'viewer'})
        .then(() => ack({userId}));
    });

    /**
     * Viewer disconnect from room
     *
     * viewer:disconnect : { roomId, viewerId }
     *
     * Return with null if ok.
     *  { error } if failed
     */
    sock.on('viewer:disconnect', ({roomId, viewerId}, ack) => {
      const viewerKey = formatter.formatRoomViewerKey(roomId, viewerId);
      const viewersListKey = formatter.formatRoomViewersListKey(roomId);

      if (viewerId !== userId) {
        return ack({ error: 'viewerId mismatch' });
      }

      db.hdelAsync(viewerKey)
        .then(() => db.spopAsync(viewersListKey))
        .then(() => delete sockets[roomId][viewerId])
        .then(() => ack(null));
    });

    /**
     * Update filelist. The file tree has to be in whole
     *
     * filelist:update : { roomId, fileList }
     *
     * Viewers receive:
     * filelist:update : { fileList }
     */
    sock.on('filelist:update', async ({roomId, fileList}) => {
      const fileListKey = formatter.formatRoomFileListKey(roomId);
      await db.setAsync(fileListKey, JSON.stringify(fileList));
      await sendToClientsInRoom(roomId, 'filelist:update', {fileList});
    });

    /**
     * Switch to another file
     *
     * editor:switch : { roomId, path, type }
     *
     * Broadcaster MAY receive event
     *    file:refresh : { path }
     * if file content is never on server
     */
    sock.on('file:switch', async ({ roomId, path, type }) => {
      const fileKey = formatter.formatRoomFileState(roomId, path);
      const yes = await db.hexistsAsync(fileKey);
      await db.hmsetAsync(fileKey, {filepath: path, fileType: type});
      if (yes) {
        sock.emit('file:refresh', {path});
      } else {
        await sendToClientsInRoom(roomId, 'file:switch', {path, type});
      }
    });

    /**
     * Update file content. Also gets pushed to viewers.
     *
     * file:content : { roomId, path, content }
     *
     * Viewers receive:
     * file:content : { path, content }
     */
    sock.on('file:content', async ({roomId, path, content}) => {
      const fileKey = formatter.formatRoomFileState(roomId, path);
      await db.hsetAsync(fileKey, 'content', content);
      await sendToClientsInRoom(roomId, 'file:content', {path, content});
    });

    /**
     * Request refresh on file content. ONLY call from a viewer.
     *
     * file:content:refresh : { roomId, path }
     *
     * Viewers receive thru ack:
     * { content }
     */
    sock.on('file:content:refresh', async ({roomId, path}, ack) => {
      const fileKey = formatter.formatRoomFileState(roomId, path);
      const content = await db.hgetAsync(fileKey, 'content');
      ack({content});
    });

    /**
     * Update editor cursor. Info may contain EITHER selection or pos.
     * If it's a single position, selection field must NOT present. Vice versa.
     *
     * editor:cursor : { roomId, selection?, pos? }
     *
     * Viewers receive:
     * { selection?, pos? } // Same reasoning as above. EITHER selection OR pos
     */
    sock.on('editor:cursor', async data => {
      const roomId = data.roomId;
      const cursorKey = formatter.formatRoomEditorCursor(roomId);
      const update : any = {};
      if (typeof data.pos === 'undefined' || data.pos === null) {
        update.selection = `${data.selection[0].join(':')},${data.selection[1].join(':')}`;
      } else {
        update.pos = data.pos.join(':');
      }
      await db.hmsetAsync(cursorKey, update);
      await sendToClientsInRoom(roomId, 'editor:cursor', update);
    });

    /**
     * Request refresh on editor cursor. ONLY call from a viewer.
     *
     * editor:cursor:refresh : { roomId }
     *
     * Viewers receive thru ack:
     * { selection?, pos? }
     * EITHER selection OR pos will be present
     */
    sock.on('editor:cursor:refresh', async ({roomId}, ack) => {
      const cursorKey = formatter.formatRoomEditorCursor(roomId);
      const retval = <any>{};
      const yes = await db.hexistsAsync(cursorKey, 'selection');
      if (yes) {
        retval.selection = await db.hgetAsync(cursorKey, 'selection');
      } else {
        retval.selection = await db.hgetAsync(cursorKey, 'pos');
      }
      ack(retval);
    });

  });

})();

export default sockio;