import { WebSocketServer } from 'ws'
import regUser from './back/helpers/regUser'

const server = new WebSocketServer({ port: 3000 })
server.on('connection', function(socket, request) {
  console.log('connected to ws server');
  socket.on('message', async function(data) {
    const receivedData =  await JSON.parse(data.toString());
    console.log('Received from client:', data.toString());
    if (receivedData.type === "reg") {
      const regResponse = await regUser(receivedData);
      socket.send(JSON.stringify(regResponse));
    }
  })

  socket.on('close', function(code) {
    console.log(`Socket closed with code: ${code}`);
  })
})

