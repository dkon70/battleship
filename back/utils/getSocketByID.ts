import { SocketsType } from "../types/types"

function getSocketByID(sockets: SocketsType[], id: number) {
  for(let i = 0; i < sockets.length; i++) {
    if(sockets[i].id === id) {
      return sockets[i].socket;
    }
  }
}

export default getSocketByID;