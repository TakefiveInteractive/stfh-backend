import * as express from 'express';
import * as http from 'http';
const  ExpressPeerServer = require('peer').ExpressPeerServer;

export const app = express();

// HTTPS challenge handling
app.get('/.well-known/acme-challenge/*', (req, res, next) => {
  res.send(process.env.LETS_ENCRYPT_CHALLENGE);
});

export const httpServer = http.createServer(app);
let server = httpServer.listen(process.env.PORT || 3000);

app.use('/peer', ExpressPeerServer(server, { proxied: true }));
app.use('/', express.static('public'))

server.on('connection', id => {
  console.log(`Client ${id} connected`);
});

server.on('disconnect', id => {
  console.log(`Client ${id} gone`);
});
