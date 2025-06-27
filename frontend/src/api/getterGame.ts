import { fetchApi } from "./fetch";
import { API_GAME } from "./routes";
import { IRoomInfos } from "../interfaces/IGame.ts";
import { IApiResponse } from '../interfaces/IApi.ts';

export async function getRoomInfos(roomId: string): Promise<IApiResponse<IRoomInfos>> {

  const response = await fetchApi<IRoomInfos>(API_GAME.ROOM_INFO + `${roomId}`, {
    method: "GET"
  })
  console.log("getRoomInfos response", response);
  return response;
}
