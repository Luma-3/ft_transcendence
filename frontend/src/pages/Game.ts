import { navbar } from "../components/ui/navbar";

import { fetchApi } from "../api/fetch";

import { onKeyDown, onKeyUp } from "../game/gameUpdate";
import { showGame } from "../game/gameShow";
import { resizeCanvas } from "../game/resizeCanvas";

import { RoomData } from "../api/interfaces/GameData";
import { User } from "../api/interfaces/User";
import { GameInfo, Opponents } from "../api/interfaces/GameData";


export var gameLoop = 0;

let roomData: RoomData;

import { API_GAME } from "../api/routes";

function showGameOpponent(roomData: RoomData) {

	const listOpponents = roomData.opponents.map((opponent) => `
		<div id=${opponent.gameName} class="flex flex-col justify-center items-center">
		<img src="/images/pp.jpg" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2 mb-4
		border-primary dark:border-dprimary" />
		<div class="flex title-responsive-size justify-center items-center">
		${opponent.gameName}
		</div>
		</div>
	`).join('');

	if (roomData.opponents.length === 1) {
		return `<div class="flex flex-col justify-center items-center">
		<img src="/images/pp.jpg" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2 mb-4
		border-primary dark:border-dprimary" />
		${roomData.gameNameOpponent || "Waiting for opponent" }
		</div>`;
	} 
	return listOpponents;
}




export default async function Game(gameInfo: GameInfo, user: User) {

  addEventListener('keypress', () => { })
	/**
	 * Mise en place du listener sur la fenetre pour redimensionner le canvas si
	 * la fenetre est redimensionnee
	 */
	window.addEventListener('resize', resizeCanvas)
	

  onkeyup = (event) => {
	onKeyUp(event);
  }

  onkeydown = (event) => {

	const divGame = document.getElementById("hiddenGame") as HTMLDivElement;
		/**
		 * Pour le premier evenement clavier, je fais apparaitre la div du jeu 
		 * et je recuperer les infos transmise dans le dashboard 
		*/
		if (divGame.classList.contains("opacity-0")) {
			return showGame(divGame);
		}
		onKeyDown(event);
	}

	const opponent = await fetchApi<Opponents>(API_GAME.ROOM_INFO + `/${gameInfo.gameId}`, { method: 'GET'});

	roomData = {
		id: gameInfo.gameId!,
		gameName: gameInfo.gameName,
		typeGame: gameInfo.typeGame,
		gameNameOpponent: gameInfo.gameNameOpponent || "",
		opponents : opponent.data?.players! || null,
	};

	/**
	 * Contenu HTML de la page
	 */
	return `
		${navbar(user)}
		<div class="flex flex-col justify-center items-center text-tertiary dark:text-dtertiary">
			
			<div id="startGameInfos" class="flex flex-col justify-center items-center pt-10
			animate-transition opacity-100 duration-500 ease-in-out">
				<div class="flex flex-row h-full w-full title-responsive-size justify-center items-center
				space-x-4 pt-40">
					<div id="userGameProfile" class="flex flex-col w-1/2 h-1/2 p-4 justify-center items-center">
						<img src="/images/pp.jpg" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2
						mb-4 transition-transform duration-800 ease-in-out
						border-primary dark:border-dprimary" />
						<div class="flex title-responsive-size justify-center items-center">
						${roomData.gameName}
						</div>
					</div>
					<div id="vsdiv" class="flex flex-col text-9xl justify-center items-center transition-transform duration-800 ease-in-out">
						VS
					</div>
					<div id="opponentGameProfile" class="flex flex-col w-1/2 h-1/2 p-4 justify-center items-center 
					transition-transform duration-800 ease-in-out">
					${showGameOpponent(roomData)}
					</div>
				</div>

				<div id="goToActionGame" class="flex flex-col text-responsive-size justify-center items-center pt-10">
					Press any key to start
				</div>
			</div>

			<div id="hiddenGame" class="flex flex-col justify-center items-center
			animate-transition opacity-0 duration-500 ease-out">
				<canvas id="gamePong" width="800" height="600" class="flex w-[800px] h-[600px] border-4 border-primary bg-transparent rounded-lg"></canvas>
				<div class="flex flex-col text-2xl p-4 justify-between items-center">
				Score
				</div>
				<div class="flex flex-row h-full w-full title-responsive-size justify-center items-center">
				<div id="user1Score" class="mx-2">
				0
				</div>
				-
				<div id="user2Score" class="mx-2">
				0
				</div>
				</div>
			</div>
			<div id="gameWin"></div>
		</div>`
}
