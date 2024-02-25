type PlayerData = {
  id: number,
  ships: [],
}

type BoardsType = {
  roomID: number,
  players: PlayerData[],
}

const boards: BoardsType[] = [];

async function addShips(data: [], roomID: number, playerID: number) {
  if (!getBoardByRoomID(roomID)) {
    boards.push({ roomID: roomID, players: [] });
    const board = getBoardByRoomID(roomID);
    board!.players.push({ id: playerID, ships: [...data] });
  } else {
    const board = getBoardByRoomID(roomID);
    board!.players.push({ id: playerID, ships: [...data] });
  }
}

function getBoardByRoomID(roomID: number) {
  for(let i = 0; i < boards.length; i++) {
    if (boards[i].roomID === roomID) {
      return boards[i];
    }
  }
  return;
}

function getShipsDataBySocketID(socketID: number) {
  for(let i = 0; i < boards.length; i++) {
    const players = boards[i].players;
    for (let j = 0; j < players.length; j++) {
      if (players[j].id === socketID) {
        return players[j].ships;
      }
    }
  }
  return;
}

function getPlayerIDsByGameId(gameId: number) {
  for (let i = 0; i < boards.length; i++) {
    if (boards[i].roomID === gameId) {
      return boards[i].players;
    }
  }
  return;
}

export { addShips, getBoardByRoomID, getShipsDataBySocketID, getPlayerIDsByGameId };