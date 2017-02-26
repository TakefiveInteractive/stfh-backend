import * as socketio from 'socket.io';
import redis from './database';
import * as uuidV4 from 'uuid/v4';
import * as formatter from './formatter';
import {start} from "repl";

const sockio = socketio();

const sessions = {};

(async function() {
  const db = <any> await redis;

  const sendToClientsInRoom = async (roomId, eventname, payload?) => {
    const roomKey = formatter.formatRoomViewersListKey(roomId);
    const viewersList = await db.smembersAsync(roomKey);
    viewersList.forEach(viewerId => Object.keys(sessions[roomId]).forEach(id => {
      if (sessions[roomId][id].type === 'viewer') {
        sessions[roomId][id].socket.emit(eventname, payload);
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
          sessions[roomId] = {broadcasterSocket: sock};
          sessions[roomId][userId] = {socket: sock, type: 'broadcaster'};
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
        .then(() => delete sessions[roomId])
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
        .then(() => sessions[roomId][userId] = {socket: sock, type: 'viewer'})
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
        .then(() => delete sessions[roomId][viewerId])
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
      const editorStateKey = formatter.formatRoomEditorState(roomId);
      const yes = await db.hexistsAsync(fileKey, 'content');

      await db.hmsetAsync(fileKey, {filepath: path, fileType: type});
      await db.hmsetAsync(editorStateKey, {filepath: path});

      if (yes) {
        sock.emit('file:refresh', {path}, async ({ content }) => {
          await db.hsetAsync(fileKey, 'content', content);
          await sendToClientsInRoom(roomId, 'file:switch', {path, type});
        });
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
      if (!content) {
        sessions[roomId].broadcasterSocket.emit('file:refresh', {path}, async ({content}) => {
          await db.hsetAsync(fileKey, 'content', content);
          ack({content})
        });
      } else {
        ack({content});
      }
    });

    /**
     * Update editor cursor. Info may contain EITHER selection or pos.
     * If it's a single position, selection field must NOT present. Vice versa.
     *
     * editor:cursor : { roomId, selection?, pos? }
     *
     * Remind that selection: [Point, Point]; pos: Point, where Point is an integer offset in buffer
     *
     * Viewers receive:
     * { selection?, pos? } // Same reasoning as above. EITHER selection OR pos
     */
    sock.on('editor:cursor', async data => {
      const roomId = data.roomId;
      const cursorKey = formatter.formatRoomEditorCursor(roomId);
      const update : any = {};
      if (typeof data.pos === 'undefined' || data.pos === null) {
        update.selection = `${data.selection[0]}-${data.selection[1]}`;
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
        retval.selection = retval.selection.split('-').forEach(n => Number.parseInt(n));
      } else {
        retval.pos = await db.hgetAsync(cursorKey, 'pos');
      }
      ack(retval);
    });

    /**
     * Insert characters to content of file
     *
     * editor:insert : { roomId, pos, content }
     * Remind that pos is integer offset of insertion point in buffer
     *
     * Viewers receive:
     * editor:insert : { content }
     */
    sock.on('editor:insert', async ({roomId, pos, content}) => {
      const editorStateKey = formatter.formatRoomEditorState(roomId);
      const filepath = await db.hgetAsync(editorStateKey, 'filepath');
      const fileKey = formatter.formatRoomFileState(roomId, filepath);

      let originalContent = await db.hgetAsync(fileKey, 'content');
      originalContent = originalContent.substring(0, pos) +
        content + originalContent.substring(pos + content.length);
      await db.hsetAsync(fileKey, 'content', originalContent);
      await sendToClientsInRoom(roomId, 'editor:insert', {content});
    });

    /**
     * Delete characters to content of file
     *
     * editor:delete : { roomId, selection }
     * Remind that selection is [Point, Point], where Point is an integer offset in buffer.
     *
     * Viewers receive:
     * editor:delete : { selection }
     */
    sock.on('editor:delete', async ({roomId, selection}) => {
      const editorStateKey = formatter.formatRoomEditorState(roomId);
      const [startPos, endPos] = selection;
      const filepath = await db.hgetAsync(editorStateKey, 'filepath');
      const fileKey = formatter.formatRoomFileState(roomId, filepath);

      let originalContent = await db.hgetAsync(fileKey, 'content');
      originalContent =
        originalContent.substring(0, startPos) + originalContent.substring(endPos + 1);
      await db.hsetAsync(fileKey, 'content', originalContent);
      await sendToClientsInRoom(roomId, 'editor:delete', selection);
    });

  });

})();

export default sockio;