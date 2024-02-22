import { RoomType } from "../types/types";
import { getUsers, getUserById } from "./users";

const rooms: RoomType[] = []
let roomNumber = 0

function createRoom(id: number) {
  const userData = getUserById(id);
  rooms.push({ id: roomNumber++, full: false, playerIDs: [id], name: userData!.name, index: userData!.index })
  console.log(rooms);
}

function updateRoom() {
  if(rooms.length === 0) {
    return { type: "update_room", data: "[]", id: 0 };
  } else {
    return { type: "update_room", data: JSON.stringify(rooms.map((el) => { return { roomId: el.id, roomUsers: [ { name: el.name, index: el.index } ] } })), id: 0 }
  }
}

function getRooms() {
  return rooms;
}

export { createRoom, getRooms, updateRoom };