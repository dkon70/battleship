import { WebSocketServer } from 'ws'
import { regUser } from './back/helpers/users'
import { createRoom, updateRoom, addUserToRoom, getRoomByIndex } from './back/helpers/rooms'
import getSocketByID from './back/utils/getSocketByID';
import { SocketsType } from './back/types/types';
import { addShips, getBoardByRoomID, getShipsDataBySocketID, getPlayerIDsByGameId } from './back/helpers/game';

let id = 0;

const server = new WebSocketServer({ port: 3000 })
const sockets: SocketsType[] = [];
const playersInGame: number[][] = [];
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
      player1Socket!.send(JSON.stringify({ type: "create_game", data: JSON.stringify({ idGame: roomData.indexRoom, idPlayer: room!.playerIDs[0] }), id: 0 }))
      player2Socket!.send(JSON.stringify({ type: "create_game", data: JSON.stringify({ idGame: roomData.indexRoom, idPlayer: room!.playerIDs[1] }), id: 0 }))
    }
    if (receivedData.type === "add_ships") {
      const data = await JSON.parse(receivedData.data);
      addShips(data.ships, data.gameId, socketID);
      const playerData = getShipsDataBySocketID(socketID);
      if (!playersInGame[data.gameId]) {
        playersInGame.push([]);
      }
      playersInGame[data.gameId].push(socketID);
      socket.send(JSON.stringify({ type: "start_game", data: JSON.stringify({ ships: playerData, currentPlayerIndex: socketID }), id: 0 }));
      socket.send(JSON.stringify({ type: "turn", data: JSON.stringify({ currentPlayer: playersInGame[data.gameId][0] }), id: 0 }));
    }
    if (receivedData.type === "attack") {
      const data = await JSON.parse(receivedData.data);
      const player1Socket = getSocketByID(sockets, socketID);
      const player2Socket = getSocketByID(sockets, playersInGame[data.gameId][0] === socketID ? playersInGame[data.gameId][1] : playersInGame[data.gameId][0]);
      if (player1Socket && player2Socket) {
        [player1Socket, player2Socket].forEach((playerSocket) => {
          playerSocket.send(JSON.stringify({ type: "turn", data: JSON.stringify({ currentPlayer: data.indexPlayer === playersInGame[data.gameId][0] ? playersInGame[data.gameId][1] : playersInGame[data.gameId][0] }), id: 0 }));
        })
      }
    }
  });

  socket.on('close', function(code) {
    console.log(`Socket closed with code: ${code}`);
  })
})

