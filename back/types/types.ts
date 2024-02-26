import WebSocket from "ws"

export type ReceivedDataType = {
  type: string,
  data: string,
  id: number
}

export type RoomType = { 
  id: number, 
  full: boolean, 
  playerIDs: number[],
  name: string,
  index: number
}

export type UsersType = {
  name: string,
  index: number,
  id: number,
  password: string
}

export type SocketsType = {
  id: number,
  socket: WebSocket
}

export type PlayerData = {
  id: number,
  ships: [],
}

export type BoardsType = {
  roomID: number,
  players: PlayerData[],
}

export type CoordinatesType = {
  x: number,
  y: number,
  hit: boolean
}

export type ShipsType = {
  length: number,
  direction: boolean,
  coordinates: CoordinatesType[],
  destroyed: boolean
}

export type PlayerBoardData = {
  [playerID: number]: ShipsType[];
}

export type FieldsType = {
  [roomID: number]: PlayerBoardData[];
}


export type ReceivedShipsData = {
  position: { x: number, y: number },
  direction: boolean,
  type: string,
  length: number
}