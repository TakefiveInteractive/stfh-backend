import * as socketio from 'socket.io';
import redis from './database';
import logger from './logger';
import * as uuidV4 from 'uuid/v4';
import * as formatter from './formatter';

const sockio = socketio();
const db = <any>redis;

sockio.on('connection', sock => {

  /**
   * Broadcaster create room
   *
   * Schema: { roomName }
   */
  sock.on('room:create', ({ roomName, broadcasterName }) => {
    const id = uuidV4();
    const broadcasterId = uuidV4();
    const key = formatter.formatRoomKey(id);

    db.hmsetAsync(key, { id, roomName })
      .then(() => {
        const broadcasterKey = formatter.formatRoomBroadcasterKey(id);
        return db.hmsetAsync(broadcasterKey, { id: broadcasterId, nickname: broadcasterName, createTime: new Date() })
      })
      .then(() => db.hmsetAsync(key, { broadcasterId }))
      .then(() => sock.emit('room:create:ok', { id, broadcasterId }));
  });

  /**
   * Viewer connect to room
   *
   * Schema: { nickname, roomId }
   */
  sock.on('viewer:connect', ({ roomId, nickname }) => {
    const id = uuidV4();
    const key = formatter.formatRoomViewerKey(roomId, id);
    const viewersListKey = formatter.formatRoomViewersList(roomId);

    db.hmsetAsync(key, { id, nickname, createTime: new Date() })
      .then(() => db.lpushAsync(viewersListKey, id))
      .then(() => sock.emit('viewer:connect:ok', { id }));
  });

  sock.on('viewer:disconnect', ({ roomId, viewerId }) => {
    const viewerKey = formatter.formatRoomViewerKey(roomId, viewerId);
    db.hdel(viewerKey)
      .then(() => db.)
  });
});

export default sockio;