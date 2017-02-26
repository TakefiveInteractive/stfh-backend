import * as redis from 'redis';
import * as bluebird from 'bluebird';
import conf from './config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

export default new Promise((resolve, reject) => {
  if (conf.redis.auth) {
    client.auth(conf.redis.auth, () => resolve(client));
  } else {
    resolve(client);
  }
});
