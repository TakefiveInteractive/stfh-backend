import * as socketio from 'socket.io';
import redis from './database';
import logger from './logger';
import * as uuidV4 from 'uuid/v4';

const sockio = socketio();

(async function () {
  const db = <any> await redis;

  sockio.on('connection', sock => {
    sock.on('viewer:connect', data => {
      db.delAsync(data.nickname)
        .then(num => {
          if (num !== 0) {
            logger.warn(`
            Nickname ${data.nickname} was present before connect. Probable synchronization issue!`);
          }
        })
        .then(db.hsetAsync(data.nickname, { id: uuidV4(), nickname: data.nickname,  }))
    });
  });

})();

export default sockio;