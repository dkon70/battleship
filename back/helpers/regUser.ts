import { ReceivedDataType } from "../types/types";

let index = 0;

async function regUser(received: ReceivedDataType) {
  try {
    const data = await JSON.parse(received.data);
    const response = {
      "type": "reg",
      "data":`{"name":"${data.name}","index": ${index++},"error": false,"errorText": ""}`,
      "id": 0,
    }
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

export default regUser;