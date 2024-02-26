import { BoardsType, FieldsType, ReceivedShipsData, ShipsType } from "../types/types";
import { addWinner } from "./leaderboard";
import { getUserById } from "./users";

const boards: BoardsType[] = [];
const fields: FieldsType = {};

function getListOfCoordinates(startPoint: { x: number, y: number }, length: number, direction: boolean) {
  const res = [];
  for (let i = 0; i < length; i++) {
    if (!direction) {
      res.push({ x: startPoint.x + i, y: startPoint.y, hit: false });
    } else {
      res.push({ x: startPoint.x, y: startPoint.y + i, hit: false });
    }
  }
  return res;
}

function generateFields(data: ReceivedShipsData[], roomID: number, playerID: number) {
  const shipsData = [];
  for (let i = 0; i < data.length; i++) {
    shipsData.push({ length: data[i].length, direction: data[i].direction, coordinates: getListOfCoordinates(data[i].position, data[i].length, data[i].direction), destroyed: false })
  }
  if (!fields[roomID]) {
    fields[roomID] = [];
    fields[roomID].push({ [playerID]: shipsData });
  } else {
    fields[roomID].push({ [playerID]: shipsData });
  }
}

async function addShips(data: [], roomID: number, playerID: number) {
  if (!getBoardByRoomID(roomID)) {
    boards.push({ roomID: roomID, players: [] });
    const board = getBoardByRoomID(roomID);
    board!.players.push({ id: playerID, ships: [...data] });
  } else {
    const board = getBoardByRoomID(roomID);
    board!.players.push({ id: playerID, ships: [...data] });
  }
  generateFields(data, roomID, playerID);
}

function checkDestroy(shipObj: ShipsType) {
  let count = 0;
  for(let i = 0; i < shipObj.coordinates.length; i++) {
    if (shipObj.coordinates[i].hit === false) {
      count++;
    }
  }
  if (count > 0) {
    return true;
  }
  return false;
}

function checkWin(shipsObj: ShipsType[]) {
  for (let i = 0; i < shipsObj.length; i++) {
    if (shipsObj[i].destroyed === false) {
      return false;
    }
  }
  return true;
}

function handleAttack(coordinates: { x: number, y: number }, roomID: number, playerID: number) {
  let enemyId = -1;
  for (let i = 0; i < fields[roomID].length; i++) {
    if (Number(Object.keys(fields[roomID][i])) !== playerID) {
      enemyId = Number(Object.keys(fields[roomID][i]))
    }
  }

  let enemyField;
  if (Number(Object.keys(fields[roomID][0])) === enemyId) {
    enemyField = fields[roomID][0][enemyId];
  } else {
    enemyField = fields[roomID][1][enemyId];
  }

  for (let i = 0; i < enemyField.length; i++) {
    for (let j = 0; j < enemyField[i].coordinates.length; j++) {
      if (enemyField[i].coordinates[j].x === coordinates.x && enemyField[i].coordinates[j].y === coordinates.y) {
        enemyField[i].coordinates[j].hit = true;
        const obj = enemyField[i];
        if (checkDestroy(obj)) {
          return JSON.stringify({ type: "attack", data: JSON.stringify({ position: { x: coordinates.x, y: coordinates.y }, currentPlayer: playerID, status: "shot" }) });
        } else {
          enemyField[i].destroyed = true;
          if (checkWin(enemyField)) {
            addWinner(getUserById(playerID)!.name);
            return JSON.stringify({ type: "finish", data: JSON.stringify({ winPlayer: playerID }) });
          } else {
            return JSON.stringify({ type: "attack", data: JSON.stringify({ position: { x: coordinates.x, y: coordinates.y }, currentPlayer: playerID, status: "killed" }) });
          }
        }
      }
    }
  }
  return JSON.stringify({ type: "attack", data: JSON.stringify({ position: { x: coordinates.x, y: coordinates.y }, currentPlayer: playerID, status: "miss" }) });
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

export { addShips, getBoardByRoomID, getShipsDataBySocketID, getPlayerIDsByGameId, handleAttack };