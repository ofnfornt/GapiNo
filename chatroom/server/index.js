import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const users = new Set();

wss.on('connection', ws => {
  const user = 'User-' + Math.floor(Math.random()*1000);
  users.add(ws);

  ws.send(JSON.stringify({type:'system', message:'Welcome '+user}));

  ws.on('message', msg => {
    const data = JSON.stringify({type:'message', user, message:msg.toString()});
    users.forEach(client => client.send(data));
  });

  ws.on('close', () => users.delete(ws));
});

app.get('/', (_,res)=>res.send('Gapnoo Chat Server Online'));

server.listen(process.env.PORT || 3000, ()=>console.log('Chat running'));
