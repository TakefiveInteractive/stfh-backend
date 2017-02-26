import app from './website/server';
import io from './relay/server';
import * as http from 'http';

const httpServer = http.createServer(app);
io.attach(httpServer);

httpServer.listen(process.env.PORT || 3000);