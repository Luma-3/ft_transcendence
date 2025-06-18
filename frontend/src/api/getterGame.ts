import { fetchApi } from "./fetch";
import { API_GAME } from "./routes";

import { IApiResponse } from '../interfaces/IApiResponse';
import { player } from "../interfaces/GameData.ts"

export async function getPlayerList(roomId: string): Promise<IApiResponse<player[]>> {
	return await fetchApi<player[]>(API_GAME.ROOM_INFO + `${roomId}/players`, {
		method: "GET"
	});
}

export async function getPlayerInfo(roomId: string, playerId: string): Promise<IApiResponse<player>> {
	return await fetchApi<player>(API_GAME.ROOM_INFO + `${roomId}` + `/players/${playerId}`, {
		method: "GET"
	});
}

export async function getPlayerOpponentsInfos(roomId: string, playerId: string): Promise<IApiResponse<player>> {
	return await fetchApi<player>(API_GAME.ROOM_INFO + `${roomId}` + `/opponents/${playerId}`, {
		method: "GET"
	});
}
