import { alert } from "../../components/ui/alert/alert";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";

import { FetchInterface } from "../../api/FetchInterface";

export async function initGame() {

	const gameType = document.querySelector('input[name="game-type"]:checked') as HTMLInputElement;
	if (!gameType) {
		return alert("no-gametype-selected", "error");
	}

	//TODO: remettre bien les ids des divs pour travailler facilement
	const player2 = (gameType.value === "localpvp") ? "SQUALALA" : ""; 

	const gameFormInfo = {
		player_name: player2 ?? "",
		game_name: "MMA in Pound !",
		game_type: gameType.id,
	}

	const userPref = await FetchInterface.getUserPrefs();
	if (!userPref) {
		return await alertTemporary("error", "Error while getting user theme", 'dark');
	}

	const success = await FetchInterface.createGameInServer(gameFormInfo);
	
	//TODO : Traduction
	return (!success) ? alertTemporary("error", "cannot-create-game-wait-and-retry", userPref.theme, true, true) : alertTemporary("success", "game-created-successfully", userPref.theme, true, true);
}