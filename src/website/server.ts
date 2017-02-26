import * as express from 'express';

const app = express();

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

// HTTPS challenge handling
app.get('/.well-known/acme-challenge/(.*)', (req, res, next) => {
  res.send(process.env.LETS_ENCRYPT_CHALLENGE);
});

export default app;
