import { drawGame } from "./gameDraw";

export function showGame() {
	const gameContainer = document.getElementById("hiddenGame") as HTMLDivElement;
	const startInfos = document.getElementById("startGameInfos") as HTMLDivElement;
	// const userGameProfile = document.getElementById("userGameProfile") as HTMLDivElement;
	// const opponentGameProfile = document.getElementById("opponentGameProfile") as HTMLDivElement;

	document.getElementById("vsdiv")!.classList.add("opacity-0");
	document.getElementById("goToActionGame")!.classList.add("opacity-0");

	setTimeout(() => {
		// userGameProfile.classList.add("-translate-x-full");
		// opponentGameProfile.classList.add("translate-x-full");
	}, 200);

	setTimeout(() => {
		// userGameProfile.classList.add("opacity-0");
		// opponentGameProfile.classList.add("opacity-0");
		startInfos.classList.add("hidden");
		gameContainer.classList.remove("opacity-0");
		gameContainer.classList.add("opacity-100");

		drawGame({
			paddle1: { position: {x: 0, y: 300 }, scale: { x: 10, y: 100 }},
			paddle2: { position: {x: 790, y: 300 }, scale: { x: 10, y: 100 }},
			ball: { position: { x: 400, y: 300 }, radius: 10 }
		});
	}, 1500);

	setTimeout(() => {
		startInfos.classList.remove("opacity-100");
		startInfos.classList.add("opacity-0");
	}
		, 1000);
}