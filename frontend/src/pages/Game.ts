import { navbar } from "../components/ui/navbar";

import { onKeyDown, onKeyUp } from "../game/gameUpdate";
import { resizeCanvas } from "../game/resizeCanvas";

import { RoomData } from "../interfaces/GameData";
import { UserInfo } from "../interfaces/User";

import { socket } from "../controllers/Socket";
import { IPlayer } from "../interfaces/GameData";
import { gameFrontInfo } from "../game/gameCreation";
import { getRoomInfos } from "../api/getterGame"

import { getUserInfo, getOtherUserInfo } from "../api/getterUser(s)"
import { API_CDN } from "../api/routes";

import { getPlayerInfo, getPlayerOpponentsInfos } from "../api/getterGame";

async function showMyself(allPlayer: IPlayer[], myselfId: string) {

  for (const player of allPlayer) {

    if (player.playerId === myselfId) {

      const playerInfo = await getUserInfo();
      return `<div id=${player.playerId} class="flex flex-col w-1/2 h-1/2 p-4 justify-center items-center
			transition-transform duration-800 ease-in-out">
			<div class="flex flex-col justify-center items-center">
				<img src=${API_CDN.AVATAR}/${playerInfo.preferences!.avatar} alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2 mb-4
				border-primary dark:border-dprimary" />
				${player.gameName}
				</div>`;
    }
  }
}

// async function showGameOpponent(allPlayer: IPlayer[], myselfId: string) {
// 	for (const player of allPlayer) {
// 		if (player.playerId !== myselfId) {
// 			const playerInfo = await getOtherUserInfo(player.playerId)
// 			console.log("player info get de l'autre user", playerInfo);
// 			return `
// 			<div id =${playerInfo.data?.id} class="flex flex-col w-1/2 h-1/2 p-4 justify-center items-center 
// 			transition-transform duration-800 ease-in-out">
// 			<div class="flex flex-col justify-center items-center">
// 			<img src=${API_CDN.AVATAR}/${playerInfo.preferences!.avatar} alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-2 mb-4
// 			border-primary dark:border-dprimary" />
// 			${player.gameName}
// 			</div>`;
// 		}
// 	}
// }

export default async function Game(roomId: string, user: UserInfo) {

  addEventListener('keypress', () => { })
  /**
   * Mise en place du listener sur la fenetre pour redimensionner le canvas si
   * la fenetre est redimensionnee
   */
  window.addEventListener('resize', resizeCanvas)


  onkeyup = (event) => {
    onKeyUp(event);
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
      console.log("Je send playerReady");
      if (!socket) {
        console.log("SOCKET EXISTE PAS")
      }
      socket!.send(JSON.stringify({
        service: 'game',
        scope: 'room',
        target: roomId,
        payload: {
          action: 'ready',
          data: {}
        }
      }));
      return;
    }

    onKeyDown(event);
  }


  /**
   * Recuperation des tous les joueurs present dans le Room pour afficher
   * tout les adversaires du joueur (tournois)
   */
  const roomInfos = await getRoomInfos(roomId);
  const myselfDiv = await showMyself(roomInfos.data?.players, user.id) || 'Bobby';

  /**
   * Contenu HTML de la page
   */
  return `
		${navbar(user)}
		<div class="flex flex-col justify-center items-center text-tertiary dark:text-dtertiary">

			<div id="startGameInfos" class="flex flex-col justify-center items-center pt-10 animate-transition opacity-100 duration-500 ease-in-out">
				<div class="flex flex-row h-full w-full title-responsive-size justify-center items-center
				space-x-4 pt-40">
					${myselfDiv}
			
					<div id = "vsdiv" class="flex flex-col text-9xl justify-center items-center transition-transform duration-800 ease-in-out" >
						VS
					</div>
					
				</div>
				<div id = "goToActionGame" class="flex flex-col text-responsive-size justify-center items-center pt-10" >
					Press any key to start
				</div>
			</div>
		</div>

			<div id = "hiddenGame" class="flex flex-col justify-center items-center animate-transition opacity-0 duration-500 ease - out">
	<canvas id="gamePong" width="800" height="600" class="flex w-[800px] h-[600px] border-4 border-primary bg-transparent rounded-lg" > </canvas>
		<div class="flex flex-col text-2xl p-4 justify-between items-center" >
			Score
			</div>
			< div class="flex flex-row h-full w-full title-responsive-size justify-center items-center" >
				<div id="user1Score" class="mx-2" >
					0
					</div>
					-
					<div id="user2Score" class="mx-2" >
						0
						</div>
						</div>
						</div>
						< div id = "gameWin" > </div>
							</div>`
}
// <!--${showGameOpponent(opponentOfMyself!)} -->
// 
