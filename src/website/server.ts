import * as express from 'express';

const app = express();

// HTTPS challenge handling
app.get('/.well-known/acme-challenge/*', (req, res, next) => {
  res.send(process.env.LETS_ENCRYPT_CHALLENGE);
});

app.use('/', express.static('public'))

export default app;
