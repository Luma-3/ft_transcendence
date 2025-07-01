import { navbar } from "../components/ui/navbar";

import { onKeyDown, onKeyUp } from "../events/game/gameUpdate";
import { resizeCanvas } from "../events/game/resizeCanvas";

import { IUserInfo } from "../interfaces/IUser";
import { getOtherUserInfo, getUserInfo } from "../api/getterUser(s)"
import { getRoomInfos } from "../api/getterGame"

import { IPlayer, IRoomInfos } from "../interfaces/IGame";
import { API_CDN } from "../api/routes";

// import { getPlayerInfo, getPlayerOpponentsInfos } from "../api/getterGame";
import { socket } from "../socket/Socket";
import { randomNameGenerator } from "../components/utils/randomNameGenerator";

async function showPlayer(playerGameInfos: IPlayer, playerInfo: IUserInfo, color: 'blue' | 'red') {

	return `<div id=${playerGameInfos.user_id} class="flex flex-col p-4 justify-center items-center
	transition-transform duration-800 ease-in-out">
	<div class="flex flex-col justify-center items-center">
		<img src=${API_CDN.AVATAR}/${playerInfo.preferences?.avatar} alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2 mb-4
		${color === 'blue' ? 'border-blue-500' : 'border-red-500'}" />
		${playerGameInfos.player_name}
		</div>
		</div>`;
}

const readyEventListener = (playerId: string) => {
	const payload = {
		service: 'game',
		scope: 'room',
		target: playerId,
		payload: {
			action: 'ready',
			data: {}
		}
	}
	socket!.send(JSON.stringify(payload));
}

export default async function game(roomId: string, user: IUserInfo) {

  // addEventListener('keypress', () => { })
  /**
   * Mise en place du listener sur la fenetre pour redimensionner le canvas si
   * la fenetre est redimensionnee
   */
  window.addEventListener('resize', resizeCanvas)

	onkeyup = (event) => {
		onKeyUp(event, user.id);
	}

	/**
	 * ! Evenement clavier lors de l'affichage du VS (Room page)
	 */
	onkeydown = (event) => {
		const divGame = document.getElementById("hiddenGame") as HTMLDivElement;
		/**
		 * Pour le premier evenement clavier, je ping le serveur pour 
		 * lui signifier que le joueur a bien rejoint la Room
		*/

		if (divGame.classList.contains("opacity-0")) {
			readyEventListener(roomId);
		}

		onKeyDown(event, user.id);
	}


	/**
	 * Recuperation des tous les joueurs present dans le Room pour afficher
	 * tout les adversaires du joueur (tournois)
	 */
	const roomInfos = await getRoomInfos(roomId);

	const leftOpponentInfos = await getOtherUserInfo(roomInfos.data!.players[0].user_id);
	const rightOpponentInfos = (roomInfos.data!.players.length > 1 && roomInfos.data!.players[1].user_id !== "other")
		? await getOtherUserInfo(roomInfos.data!.players[1].user_id)
		: {
			data: {
				preferences: {
					avatar: 'default.png'
				},
				player_name: randomNameGenerator(),
			}
		};


	let rightOpponentDiv = '';

	const leftOpponentDiv = await showPlayer(roomInfos.data!.players[0], leftOpponentInfos?.data, 'blue');
	if (roomInfos.data!.players.length > 1) {
		rightOpponentDiv = await showPlayer(roomInfos.data!.players[1], rightOpponentInfos?.data, 'red');
	} else {
		rightOpponentDiv = `<div id="otherPlayerDiv" class="flex flex-col p-4 justify-center items-center
		transition-transform duration-800 ease-in-out">
		<div class="flex flex-col justify-center items-center">
			<img src=${API_CDN.AVATAR}/default.png alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2 mb-4
			border-red-500" />
			${randomNameGenerator()}
			</div>
			</div>`;
	}




	/**
	 * Contenu HTML de la page
	 */
	// ${navbar(user)}
	return `
<div class="flex flex-col justify-center items-center text-tertiary dark:text-dtertiary">
	
	<div id="startGameInfos" class="flex flex-col justify-center items-center pt-10 animate-transition opacity-100 duration-500 ease-in-out">

		<div class="flex flex-row h-full w-full title-responsive-size justify-center items-center space-x-4 pt-40">

			${leftOpponentDiv}
	
			<div id = "vsdiv" class="flex text-9xl justify-center items-center transition-transform duration-800 ease-in-out" >
				
				VS
			
			</div>

			${rightOpponentDiv}
		
		</div>
		<div id = "goToActionGame" class="flex flex-col text-responsive-size justify-center items-center pt-10" >

			Press any key to start

		</div>
	</div>
</div>

<div id = "hiddenGame" class="flex flex-col justify-center mt-0 items-center animate-transition opacity-0 duration-500 ease-in-out">

	<!-- Zone de jeu avec bannières -->
	<div class="flex flex-row justify-center items-center gap-4">
		
		<!-- Bannière gauche -->
		<div id="leftBanner" class="flex flex-col justify-center items-center w-32 h-[400px] bg-gradient-to-b from-purple-500 to-purple-700 rounded-lg border-2 border-purple-400 shadow-lg">
			<div class="flex flex-col items-center text-white p-4 space-y-4">
				<div class="text-lg font-bold">
				${roomInfos.data!.players[0].player_name}
				</div>
				<div id="player1Avatar" class="w-16 h-16 rounded-full border-2 border-white bg-purple-300">
				<img src=${API_CDN.AVATAR}/${leftOpponentInfos?.data?.preferences?.avatar} alt="avatar" class="w-full h-full rounded-full">
				</div>
				<div id="player1Stats" class="flex flex-col text-sm text-center space-y-2 mt-5">
					<div>Score: <span class="relative bottom-0 text-8xl" id="p1Score">0</span></div>
				</div>
			</div>
		</div>
		
		<!-- Canvas de jeu -->
		<canvas id="gamePong" width="800" height="600" class="flex w-[800px] h-[600px] border-4 border-myblack bg-transparent rounded-lg mt-10" > </canvas>
		
		<!-- Bannière droite -->
		<div id="rightBanner" class="flex flex-col justify-center items-center w-32 h-[400px] bg-gradient-to-b from-orange-500 to-orange-700 rounded-lg border-2 border-orange-400 shadow-lg">
			<div class="flex flex-col justify-center items-center text-white p-4 space-y-4">
				<div class="flex justify-center items-center text-lg font-bold text-center">
					${(roomInfos.data!.players[1] ? roomInfos.data!.players[1].player_name : 'Waiting for opponent')}
				</div>
				<div id="player2Avatar" class="w-16 h-16 rounded-full border-2 border-white bg-orange-300">
					<img src=${API_CDN.AVATAR}/${rightOpponentInfos?.data?.preferences?.avatar} alt="avatar" class="w-full h-full rounded-full">
				</div>
				<div id="player2Stats" class="flex flex-col text-sm text-center space-y-2 mt-5">
					<div>Score: <span class="relative bottom-0 text-8xl" id="p2Score">0</span></div>
				</div>
			</div>
		</div>
		
	</div>
	
	
	</div>
	
	<div id="gameWin">
	</div>`
}

// <!-- Score principal -->
// <div class="flex flex-col text-2xl p-4 justify-between items-center" >
	
// 	Score
	
// </div>
// <div class="flex flex-row h-full w-full title-responsive-size justify-center items-center" >
	
// 	<div id="user1Score" class="mx-2" >
		
// 		0
	
// 	</div>
// 	-
	
// 	<div id="user2Score" class="mx-2" >
	
// 		0
	
// 	</div>

// </div>
