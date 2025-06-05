import { navbar } from "../components/ui/navbar";

import { onKeyDown, onKeyUp } from "../game/gameUpdate";
import { resizeCanvas } from "../game/resizeCanvas";

import { RoomData } from "../interfaces/GameData";
import { User } from "../interfaces/User";

import { socket } from "../controllers/Socket";
import { player } from "../interfaces/GameData";
import { gameFrontInfo } from "../game/gameCreation";

function showGameOpponent(opponents: player) { return; }
// 	const listOpponents = opponents.map((opponent) => `
// 		<div id=${opponent.gameName} class="flex flex-col justify-center items-center">
// 		<img src="/images/pp.jpg" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2 mb-4
// 		border-primary dark:border-dprimary" />
// 		<div class="flex title-responsive-size justify-center items-center">
// 		${opponent.gameName}
// 		</div>
// 		</div>
// 	`).join('');

// 	if (opponents === 1) {
// 		return `<div class="flex flex-col justify-center items-center">
// 		<img src="/images/pp.jpg" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2 mb-4
// 		border-primary dark:border-dprimary" />
// 		${opponents.gameName || "Waiting for opponent" }
// 		</div>`;
// 	} 
// 	return listOpponents;
// }



export default async function Game(roomData: RoomData, user: User) {

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
		 * Pour le premier evenement clavier, je ping le serveur pour 
		 * lui signifier que le joueur a bien rejoint la Room
		*/
		if (divGame.classList.contains("opacity-0")) {
			socket!.send(JSON.stringify({
				type: "game",
				payload: {
					type: 'playerJoin',
					data: {
						roomId: roomData.roomId,
					}
				}
			}))
			return;
		/**
		 * pour le deuxieme evenement clavier, on valide le joueur pour lancer le jeu
		 */
		} else if (event.key === "Space") {
			socket?.send(JSON.stringify({
			type: "game",
			payload: {
				type: 'playerReady',
				data: {
					roomId: roomData.roomId,
				}
			},
			}));
			return;
		}

		onKeyDown(event);
	}
	
	
	/**
	 * Recuperation des tous les joueurs present dans le Room pour afficher
	 * tout les adversaires du joueur (tournois)
	 */
	const opponentOfMyself = roomData.players.find((opponent) => opponent.playerId !== gameFrontInfo.playerId);
	
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
					<div id=${gameFrontInfo.gameName} class="flex flex-col w-1/2 h-1/2 p-4 justify-center items-center">
						<img src="/images/pp.jpg" alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2
						mb-4 transition-transform duration-800 ease-in-out
						border-primary dark:border-dprimary" />
						<div class="flex title-responsive-size justify-center items-center">
						${gameFrontInfo.gameName}
						</div>
					</div>
					<div id="vsdiv" class="flex flex-col text-9xl justify-center items-center transition-transform duration-800 ease-in-out">
						VS
					</div>
					<div id="opponentGameProfile" class="flex flex-col w-1/2 h-1/2 p-4 justify-center items-center 
					transition-transform duration-800 ease-in-out">
					${showGameOpponent(opponentOfMyself!)}
					</div>
				</div>

				<div id="goToActionGame" class="flex flex-col text-responsive-size justify-center items-center pt-10">
					Press any key to start
				</div>
			</div>

			/**
			 * ! Div principale du jeu !
			 */
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
