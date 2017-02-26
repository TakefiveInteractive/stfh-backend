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
     * room:create:ok
     */
    sock.on('room:create', ({roomName, broadcasterName}) => {
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
        .then(() => sock.emit('room:create:ok', {roomId, userId}));
    });

    /**
     * Delete room. Only broadcaster can do this
     *
     * room:delete : { roomId, broadcasterId }
     * room:delete:ok
     * room:delete:fail { reason } // Due to broadcasterId mismatch
     */
    sock.on('room:delete', ({ roomId, broadcasterId }) => {
      const roomKey = formatter.formatRoomKey(roomId);
      const broadcasterKey = formatter.formatRoomBroadcasterKey(userId);

      if (broadcasterId !== userId) {
        return sock.emit('room:delete:fail', { error: 'broadcasterId mismatch' });
      }
      db.hdelAsync(broadcasterKey)
        .then(() => db.hdelAsync(roomKey))
        .then(() => delete sockets[userId])
        .then(() => sock.emit('room:delete:ok'));
    });

    /**
     * Viewer connect to room
     *
     * viewer:connect : { nickname, roomId }
     * viewer:connect:ok : { id }
     */
    sock.on('viewer:connect', ({roomId, nickname}) => {
      const viewerKey = formatter.formatRoomViewerKey(roomId, userId);
      const viewersListKey = formatter.formatRoomViewersListKey(roomId);

      db.hmsetAsync(viewerKey, {userId, nickname, createTime: new Date()})
        .then(() => db.saddAsync(viewersListKey, userId))
        .then(() => sockets[userId].type = 'viewer')
        .then(() => sock.emit('viewer:connect:ok', {userId}));
    });

    /**
     * Viewer disconnect from room
     *
     * viewer:disconnect : { roomId, viewerId }
     * viewer:disconnect:ok
     * room:disconnect:fail { reason } // Due to viewerId mismatch
     */
    sock.on('viewer:disconnect', ({roomId, viewerId}) => {
      const viewerKey = formatter.formatRoomViewerKey(roomId, viewerId);
      const viewersListKey = formatter.formatRoomViewersListKey(roomId);

      if (viewerId !== userId) {
        return sock.emit('viewer:disconnect:fail');
      }

      db.hdelAsync(viewerKey)
        .then(() => db.spopAsync(viewersListKey))
        .then(() => delete sockets[viewerId])
        .then(() => sock.emit('viewer:disconnect:ok'));
    });

    /**
     * Update filelist. The file tree has to be in whole
     *
     * filelist:update : { roomId, fileList }
     * room:ready
     *
     * Client side:
     * filelist:push : { fileList }
     */
    sock.on('filelist:update', async ({roomId, fileList}) => {
      const fileListKey = formatter.formatRoomFileListKey(roomId);
      await db.setAsync(fileListKey, JSON.stringify(fileList));
      await sendToClientsInRoom(roomId, 'filelist:push', {fileList});
      sock.emit('room:ready');
    });

    /**
     * Switch to another file
     *
     * file:switch : { roomId, path, type }
     * file:refresh : { path }
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