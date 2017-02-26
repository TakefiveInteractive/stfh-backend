import { app, httpServer } from './website/server';
import io from './relay/server';

io.attach(httpServer);
