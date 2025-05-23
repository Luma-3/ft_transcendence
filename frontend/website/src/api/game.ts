import { fetchApi } from "./fetch"
import { getUserInfo } from "./getter";
import { API_GAME } from "./routes";
import { alert } from "../components/ui/alert/alert";
import { renderGame } from "../components/renderPage";

export async function initGame(gameData: any) {
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		window.location.href = "/login";
		return;
	}
	const response = await fetchApi(API_GAME.LOCAL_CREATE, {
		method: 'POST',
		body: JSON.stringify({
			player1: gameData.player1,
			player2: gameData.player2,
			gameType: gameData.gameType,
		})
	});
	if (response && response.status === "error") {
		alert(response.message, "error");
		return;
	}

	return renderGame(gameData);
}