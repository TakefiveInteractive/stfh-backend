import * as socketio from 'socket.io';
import redis from './database';
import * as uuidV4 from 'uuid/v4';
import * as formatter from './formatter';

const sockio = socketio();

const sockets = {};

(async function() {
  const db = <any> await redis;

  const sendToClientsInRoom = async (roomId, eventname, payload?) => {
    const roomKey = formatter.formatRoomViewersListKey(roomId);
    const viewersList = await db.smembersAsync(roomKey);
    viewersList.forEach(viewerId => Object.keys(sockets).forEach(id => {
      if (sockets[id].type === 'viewer') {
        sockets[id].emit(eventname, payload);
      }
    }));
  };

  sockio.on('connection', sock => {

    const userId = uuidV4();
    sockets[userId] = {
      socket: sock,
      type: ''
    };

    /**
     * Broadcaster create room
     *
     * room:create : { roomName }
     *
     * Return with { roomId, userId }
     */
    sock.on('room:create', ({roomName, broadcasterName}, ack) => {
      const roomId = uuidV4();
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
        .then(() => sockets[userId].type = 'broadcaster')
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
        .then(() => delete sockets[userId])
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
        .then(() => sockets[userId].type = 'viewer')
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
        .then(() => delete sockets[viewerId])
        .then(() => ack(null));
    });

    /**
     * Update filelist. The file tree has to be in whole
     *
     * filelist:update : { roomId, fileList }
     *
     * Broadcaster receives event
     * room:ready
     *
     * Viewers receive:
     * filelist:push : { fileList }
     */
    sock.on('filelist:update', async ({roomId, fileList}) => {
      const fileListKey = formatter.formatRoomFileListKey(roomId);
      await db.setAsync(fileListKey, JSON.stringify(fileList));
      await sendToClientsInRoom(roomId, 'filelist:push', {fileList});
    });

    /**
     * Switch to another file
     *
     * file:switch : { roomId, path, type }
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
      }
    });

    sock.on('cursor:update', async data => {
      if (typeof data.pos === 'undefined' || data.pos === null) {
        
      }
    });

  });

})();

export default sockio;