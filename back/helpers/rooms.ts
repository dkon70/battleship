import { RoomType } from "../types/types";
import { getUserById } from "./users";

const rooms: RoomType[] = []
let roomNumber = 0

function createRoom(id: number) {
  const userData = getUserById(id);
  rooms.push({ id: roomNumber++, full: false, playerIDs: [id], name: userData!.name, index: roomNumber - 1 })
}

function updateRoom() {
  if(rooms.length === 0) {
    return { type: "update_room", data: "[]", id: 0 };
  } else {
    const freeRooms: RoomType[] = [];
    for (let i = 0; i < rooms.length; i++) {
      if (!rooms[i].full) {
        freeRooms.push(rooms[i]);
      }
    }
    return { type: "update_room", data: JSON.stringify(freeRooms.map((el) => { return { roomId: el.id, roomUsers: [ { name: el.name, index: el.index } ] } })), id: 0 }
  }
}

function getRooms() {
  return rooms;
}

function getRoomByIndex(index: number) {
  for(let i = 0; i < rooms.length; i++) {
    if (rooms[i].index === index) {
      return rooms[i];
    }
  }
}

async function addUserToRoom(index: number, id: number) {
  const room = getRoomByIndex(index);
  const user = getUserById(id);
  const roomInd = rooms.indexOf(room!)
  rooms[roomInd].full = true;
  rooms[roomInd].playerIDs.push(user!.id);
}

export { createRoom, getRooms, updateRoom, addUserToRoom, getRoomByIndex };