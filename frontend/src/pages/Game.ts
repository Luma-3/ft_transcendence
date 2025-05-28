import { navbar } from "../components/ui/navbar";
import notFoundPage from "./4xx";

import { getUserInfo } from "../api/getter";
import { fetchToken } from "../api/fetchToken";
import { fetchApi } from "../api/fetch";

import { onKeyDown, onKeyUp } from "../game/gameUpdate";
import { launchGame } from "../game/gameStart";

import { RoomData } from "../api/interfaces/GameData";

import { GameInfo, Opponents } from "../api/interfaces/GameData";


export var gameLoop = 0;

let roomData: RoomData;

//TODO : Prevoir une variable pour le deuxieme joueur qui sera fetch dans le fonction principale
import { API_GAME, API_USER } from "../api/routes";
import { renderGame } from "../components/renderPage";

export default async function Game(gameData: GameInfo) {

  addEventListener('keypress', (event) => { })

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
		return launchGame(divGame);
		}
		onKeyDown(event);
	}

  const token = await fetchToken();
  if (token.status === "error") {
    return notFoundPage();
  }

  const user = await getUserInfo();
  if (user.status === "error" || !user.data) {
    return notFoundPage();
  }

  const opponent = await fetchApi<Opponents>(API_GAME.ROOM_INFO + `/${gameData.gameId}`, {
	method: 'GET',
	});

	roomData = {
		id: gameData.gameId!,
		gameName: gameData.gameName,
		typeGame: gameData.typeGame,
		opponents: opponent.data!,
	};
  /**
   * Contenu HTML de la page
   */
  return `
	${navbar(user.data)}
	<div class="flex flex-col justify-center items-center text-tertiary dark:text-dtertiary">
		
		<div id="startGameInfos" class="flex flex-col justify-center items-center pt-10
		animate-transition opacity-100 duration-500 ease-in-out">
			<div class="flex flex-row h-full w-full title-responsive-size justify-center  items-center
	 		space-x-4 pt-40">
				<div class="flex flex-col justify-center items-center">
					<img src="/images/pp.jpg" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2
					mb-4
					border-primary dark:border-dprimary" />
					${roomData.gameName}
				</div>
				<div class="flex flex-col justify-center items-center">
					VS
				</div>
				<div class="flex flex-col justify-center items-center">
					<img src="/images/500Logo.png" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2
					mb-4 border-primary dark:border-dprimary" />
					${roomData.opponents.all[0].gameName}
				</div>
			</div>

			<div class="flex flex-col text-responsive-size justify-center items-center pt-10">
				Press any key to start
			</div>
		</div>

		<div id="hiddenGame" class="flex flex-col justify-center items-center
		animate-transition opacity-0 duration-500 ease-out">
			<canvas id="gamePong" width="800" height="600" class="flex w-[800px] h-[600px] border-2 border-primary bg-zinc-400"></canvas>
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
