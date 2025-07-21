import { GameManager } from "../GameManager";
import { renderErrorPage } from "../../../controllers/renderPage";

export async function showGame() {

	const game = GameManager.getGame();
	if (!game) {
		return renderErrorPage("404", "Game not found, WTF bro t'as fais quoi ?");
	}

	const userId = game.userId;
	const otherId = [...game.paddles.keys()].find(id => id !== userId);

	const gameContainer = document.getElementById("hiddenGame") as HTMLDivElement;
	const startInfos = document.getElementById("startGameInfos") as HTMLDivElement;
	
	const myProfile = document.getElementById(`${userId}`) as HTMLDivElement;
	const opponentGameProfile = document.getElementById(`${otherId}`) as HTMLDivElement;

	document.getElementById("vsdiv")!.classList.add("opacity-0");
	document.getElementById("goToActionGame")!.classList.add("opacity-0");

	setTimeout(() => {
		myProfile.classList.add("-translate-x-full");
		opponentGameProfile.classList.add("translate-x-full");
	}, 200);

	setTimeout(() => {
		myProfile.classList.add("opacity-0");
		opponentGameProfile.classList.add("opacity-0");
		startInfos.classList.add("hidden");
		gameContainer.classList.remove("opacity-0");
		gameContainer.classList.add("opacity-100");
		game.start();
	}, 1500);

	setTimeout(() => {
		startInfos.classList.remove("opacity-100");
		startInfos.classList.add("opacity-0");
	}
		, 1000);
	
}
