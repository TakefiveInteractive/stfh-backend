import app from './website/server';
import io from './relay/server';
import http from 'http';

const httpServer = http.createServer(app);
io.attach(httpServer);

httpServer.listen(3000);