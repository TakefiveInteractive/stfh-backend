import * as fs from 'fs';

type Config = {
  redis: {
    host: string;
    port: number;
    auth?: string;
  }
};

const devConfig: Config = {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    auth: process.env.REDIS_AUTH || undefined
  }
};

function getConfig () {
  try {
    if (process.env.REDIS_URL) {
      console.log('On Heroku');
      let [whole, auth, host, port] = /redis:\/\/h:([a-z0-9]+)@([\.\-a-z0-9]+):([0-9]+)/.exec(process.env.REDIS_URL);
      return {
        redis: {
          host,
          port,
          auth
        }
      }
    } else {
      // on our machine
      console.log('On local machine');
      return devConfig;
    }
  } catch (err) {
    return devConfig;
  }
}

export default getConfig();
