import { IPlayer } from "../interfaces/IGame";
import { IGame } from "../events/game/Game";
import { truncateText } from "../components/utils/truncateText";

async function showPlayer(playerGameInfos: IPlayer, color: 'blue' | 'red') {

	return `
<div id=${playerGameInfos.id} class="flex flex-col p-4 justify-center items-center transition-transform duration-800 ease-in-out">
	<div class="flex flex-col justify-center items-center">

		<img src=${playerGameInfos.avatar} alt="logo" class="w-40 h-40 md:w-70 md:h-70 rounded-lg border-4 mb-4
		${color === 'blue' ? 'border-dprimary' : 'border-dsecondary'}" />
		<div class="flex w-40 justify-center items-center font-title mb-2">
		${truncateText(playerGameInfos.player_name, 15)}
		</div>

	</div>

</div>`;
}
export default async function gameHtml(gameInfo: IGame, userId: string) {
	const playerLeft = gameInfo.players.find(player => player.id === userId)!;
	const playerRight = gameInfo.players.find(player => player.id !== userId)!;

	const leftOpponentDiv = await showPlayer(playerLeft, 'blue');
	const rightOpponentDiv = await showPlayer(playerRight, 'red');


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
		<div id="goToActionGame" translate="goToActionGame" class="flex flex-col text-responsive-size justify-center items-center pt-10" >

			Press any key to start

		</div>
	</div>
</div>

<div id="hiddenGame" class="flex flex-col justify-center mt-0 items-center animate-transition opacity-0 duration-500 ease-in-out">
	
	<!-- Zone de jeu avec bannières -->
	<div id="gameName" class="text-4xl font-title text-center mt-4 mb-2 text-tertiary dark:text-dprimary">
		${gameInfo.name}
	</div>
	<div class="flex flex-row justify-center items-center gap-4">
		
		<!-- Bannière gauche -->
		<div id="leftBanner" class="flex flex-col justify-center items-center w-32 h-[400px] bg-gradient-to-b from-purple-500 to-purple-700 rounded-lg border-2 border-purple-400 shadow-lg">
			<div class="flex flex-col items-center text-white p-4 space-y-4">
				<div class="text-lg font-bold">
				${playerLeft.player_name}
				</div>
				<div id="player1Avatar" class="w-16 h-16 rounded-full border-2 border-white bg-purple-300">
				<img src=${playerLeft.avatar} alt="avatar" class="w-full h-full rounded-full">
				</div>
				<div id="player1Stats" class="flex flex-col text-sm text-center space-y-2 mt-5">
					<div>Score: <div id="${playerLeft.id}-score" class="relative bottom-0 text-8xl">0</div></div>
				</div>
			</div>
		</div>
		
		<!-- Canvas de jeu -->
		<canvas id="game" width="800" height="600" class=" border-4 border-myblack bg-transparent rounded-lg mt-2 box-content" > </canvas>
		
		<!-- Bannière droite -->
		<div id="rightBanner" class="flex flex-col justify-center items-center w-32 h-[400px] bg-gradient-to-b from-orange-500 to-orange-700 rounded-lg border-2 border-orange-400 shadow-lg">
			<div class="flex flex-col justify-center items-center text-white p-4 space-y-4">
				<div class="flex justify-center items-center text-lg font-bold text-center ">
					${truncateText(playerRight.player_name, 10)}
				</div>
				<div id="player2Avatar" class="w-16 h-16 rounded-full border-2 border-white bg-orange-300">
					<img src=${playerRight.avatar} alt="avatar" class="w-full h-full rounded-full">
				</div>
				<div id="player2Stats" class="flex flex-col text-sm text-center space-y-2 mt-5">
					<div>Score: <div id="${playerRight.id}-score" class="relative bottom-0 text-8xl">0</div></div>
				</div>
			</div>
		</div>

		</div>
		<div class="flex flex-row mt-2 mb-2 w-full font-title text-tertiary dark:text-dtertiary justify-center items-center p-2">
		<button id="leaveGame" class="flex flex-row items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" translate="leave-game">
		Leave Game
		</button>
		<img src="/images/duckQuitGame.png" alt="logo" class="w-10 h-10 ml-4">
		</div>
		</div>
		<div id="gameWin">
		</div>
		`
}
