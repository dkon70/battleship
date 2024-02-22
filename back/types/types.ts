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
  id: number
}