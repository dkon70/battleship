import { ReceivedDataType } from "../types/types";
import { UsersType } from "../types/types";

let index = 0;
const users: UsersType[] = [];

async function regUser(received: ReceivedDataType, id: number) {
  try {
    const data = await JSON.parse(received.data);
    const response = {
      "type": "reg",
      "data":`{"name":"${data.name}","index": ${index++},"error": false,"errorText": ""}`,
      "id": 0,
    }
    users.push({ name: JSON.parse(response.data).name, index: JSON.parse(response.data).index, id: id })
    return response;
  } catch (error) {
    const response = {
      "type": "reg",
      "data":`{"name":"","index":"","error": true,"errorText": "${error}"}`,
      "id": 0,
    }
    return response;
  }
}

function getUsers() {
  return users;
}

function getUserById(id: number) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
}

export { regUser, getUsers, getUserById };