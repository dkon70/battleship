import { WebSocketServer } from 'ws'
import { regUser, getUsers } from './back/helpers/users'
import { createRoom, updateRoom } from './back/helpers/rooms'

let id = 0;

const server = new WebSocketServer({ port: 3000 })
server.on('connection', function(socket, request) {
  const socketID = id++;
  console.log('connected to ws server');
  socket.on('message', async function(data) {
    const receivedData =  await JSON.parse(data.toString());
    console.log('Received from client:', data.toString());
    if (receivedData.type === "reg") {
      const regResponse = await regUser(receivedData, socketID);
      socket.send(JSON.stringify(regResponse));
      socket.send(JSON.stringify(updateRoom()));
      socket.send(JSON.stringify({ type: "update_winners", data: "[]", id: 0 }))
    }
    if (receivedData.type === "create_room") {
      createRoom(socketID);
      socket.send(JSON.stringify(updateRoom()));
    }
  })

  socket.on('close', function(code) {
    console.log(`Socket closed with code: ${code}`);
  })
})

