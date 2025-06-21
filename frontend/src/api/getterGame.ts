import { fetchApi } from "./fetch";
import { API_GAME } from "./routes";
import { IRoomInfos } from "../interfaces/IGame.ts";
import { IApiResponse } from '../interfaces/IApi.ts';
import { IPlayer } from "../interfaces/IGame.ts"

// export async function getPlayerList(roomId: string): Promise<IApiResponse<IPlayer[]>> {
// 	return await fetchApi<IPlayer[]>(API_GAME.ROOM_INFO + `${roomId}/players`, {
// 		method: "GET"
// 	});
// }

// export async function getPlayerInfo(roomId: string, playerId: string): Promise<IApiResponse<IPlayer>> {
// 	return await fetchApi<IPlayer>(API_GAME.ROOM_INFO + `${roomId}` + `/players/${playerId}`, {
// 		method: "GET"
// 	});
// }

// export async function getPlayerOpponentsInfos(roomId: string, playerId: string): Promise<IApiResponse<IPlayer>> {
// 	return await fetchApi<IPlayer>(API_GAME.ROOM_INFO + `${roomId}` + `/opponents/${playerId}`, {
// 		method: "GET"
// 	});
// }

export async function getRoomInfos(roomId: string): Promise<IApiResponse<IRoomInfos>> {

	const response = await fetchApi<IRoomInfos>(API_GAME.ROOM_INFO + `${roomId}`, {
		method: "GET"
	})
	return response;
}
