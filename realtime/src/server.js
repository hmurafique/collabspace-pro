import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('chat-message', msg => {
    io.emit('chat-message', msg);
  });
});

app.get('/health', (req,res) => res.json({ ok:true, name:'realtime' }));

const port = process.env.PORT || 6000;
http.listen(port, ()=>console.log('Realtime listening', port));
