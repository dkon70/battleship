import { WebSocketServer } from 'ws'
import { regUser } from './back/helpers/users'
import { createRoom, updateRoom, addUserToRoom, getRoomByIndex } from './back/helpers/rooms'
import getSocketByID from './back/utils/getSocketByID';
import { SocketsType } from './back/types/types';

let id = 0;

const server = new WebSocketServer({ port: 3000 })
const sockets: SocketsType[] = [];
server.on('connection', function(socket, request) {
  const socketID = id++;
  sockets.push({ id: socketID, socket: socket })
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
    if (receivedData.type === "add_user_to_room") {
      const response = await JSON.parse(data.toString());
      const roomData = await JSON.parse(response.data);
      await addUserToRoom(roomData.indexRoom, socketID);
      socket.send(JSON.stringify(updateRoom()));
      const room = getRoomByIndex(roomData.indexRoom);
      const player1Socket = getSocketByID(sockets, room!.playerIDs[0]);
      const player2Socket = getSocketByID(sockets, room!.playerIDs[1]);
      player1Socket!.send(JSON.stringify({ type: "create_game", data: JSON.stringify({ idGame: roomData.indexRoom, idPlayer: socketID }), id: 0 }))
      player2Socket!.send(JSON.stringify({ type: "create_game", data: JSON.stringify({ idGame: roomData.indexRoom, idPlayer: socketID }), id: 0 }))
    }
  })

  socket.on('close', function(code) {
    console.log(`Socket closed with code: ${code}`);
  })
})

