import app from './website/server';
import io from './relay/server';
import * as http from 'http';
var ExpressPeerServer = require('peer').ExpressPeerServer;

const httpServer = http.createServer(app);
io.attach(httpServer);

let server = httpServer.listen(process.env.PORT || 3000);

app.use('/peer', ExpressPeerServer(server, { }));

server.on('connection', id => {
  console.log(`Client ${id} connected`);
});

server.on('disconnect', id => {
  console.log(`Client ${id} gone`);
});
