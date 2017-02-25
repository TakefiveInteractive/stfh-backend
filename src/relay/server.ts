import sockio from 'socket.io';
import redis from './database';
import logger from './logger';
import uuidV4 from 'uuid/v4';

const sockio = sockio();
const db = <any>redis;

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

export default sockio;