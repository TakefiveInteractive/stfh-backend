import * as socketio from 'socket.io';
import redis from './database';
import * as uuidV4 from 'uuid/v4';
import * as formatter from './formatter';

const sockio = socketio();

(async function() {
  const db = <any> await redis;

  sockio.on('connection', sock => {

    /**
     * Broadcaster create room
     *
     * room:create : { roomName }
     * room:create:ok
     */
    sock.on('room:create', ({roomName, broadcasterName}) => {
      const id = uuidV4();
      const broadcasterId = uuidV4();
      const key = formatter.formatRoomKey(id);

      db.hmsetAsync(key, {id, roomName})
        .then(() => {
          const broadcasterKey = formatter.formatRoomBroadcasterKey(id);
          return db.hmsetAsync(broadcasterKey, {
            id: broadcasterId,
            nickname: broadcasterName,
            createTime: new Date()
          })
        })
        .then(() => db.hmsetAsync(key, {broadcasterId}))
        .then(() => sock.emit('room:create:ok', {id, broadcasterId}));
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
      const broadcasterKey = formatter.formatRoomBroadcasterKey(broadcasterId);

      db.hgetAsync(broadcasterKey, 'id')
        .then(id => {
          if (id !== broadcasterId) {
            return sock.emit('room:delete:fail', { error: 'broadcasterId mismatch' });
          }
          return db.hdelAsync(broadcasterKey);
        })
        .then(() => db.hdelAsync(roomKey))
        .then(() => sock.emit('room:delete:ok'));
    });

    /**
     * Viewer connect to room
     *
     * viewer:connect : { nickname, roomId }
     * viewer:connect:ok : { id }
     */
    sock.on('viewer:connect', ({roomId, nickname}) => {
      const id = uuidV4();
      const key = formatter.formatRoomViewerKey(roomId, id);
      const viewersListKey = formatter.formatRoomViewersList(roomId);

      db.hmsetAsync(key, {id, nickname, createTime: new Date()})
        .then(() => db.saddAsync(viewersListKey, id))
        .then(() => sock.emit('viewer:connect:ok', {id}));
    });

    /**
     * Viewer disconnect from room
     *
     * viewer:disconnect : { roomId, viewerId }
     * viewer:disconnect:ok
     */
    sock.on('viewer:disconnect', ({roomId, viewerId}) => {
      const viewerKey = formatter.formatRoomViewerKey(roomId, viewerId);
      const viewersListKey = formatter.formatRoomViewersList(roomId);
      db.hdelAsync(viewerKey)
        .then(() => db.spopAsync(viewersListKey))
        .then(() => sock.emit('viewer:disconnect:ok'));
    });

  });

})();

export default sockio;