import { ReceivedDataType } from "../types/types";
import { UsersType } from "../types/types";

let index = 0;
const users: UsersType[] = [];

type RegData = {
  name: string,
  password: string,
  index: number
}

function checkExist(data: RegData) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === data.name) {
      return true;
    }
  }
  return false;
}

function validateUser(data: RegData) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === data.name && users[i].password === data.password) {
      return true;
    }
  }
  return false;
}

async function regUser(received: ReceivedDataType, id: number) {
  try {
    const data = await JSON.parse(received.data);
    if (!checkExist(data)) {
      const response = {
        "type": "reg",
        "data":`{"name":"${data.name}","index": ${index++},"error": false,"errorText": ""}`,
        "id": 0,
      }
      users.push({ name: data.name, index: JSON.parse(response.data).index, id: id, password: data.password })
      return response;
    } else {
      if (validateUser(data)) {
        const response = {
          "type": "reg",
          "data": `{"name": "${data.name}", "index": ${getUserByName(data.name)!.index}, "error": false, "errorText": ""}`,
          "id": 0
        }
        const index = getUserByName(data.name)!.index;
        users[index].id = id;
        return response;
      } else {
        throw new Error("Password is incorrect");
      }
    }
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

function getUserByName(name: string) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].name === name) {
      return users[i];
    }
  }
}

export { regUser, getUsers, getUserById };