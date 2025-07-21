import { FetchInterface } from "../api/FetchInterface";
import { fadeIn, fadeOut } from "../components/utils/fade";
import { removeLoadingScreen } from "../components/utils/removeLoadingScreen";
import { setupColorTheme } from "../components/utils/setColorTheme";
import { truncateText } from "../components/utils/truncateText";
import { translatePage } from "../controllers/Translate";
import { sendInSocket } from "../socket/Socket";

export async function initTournament(data: any) {
	const user = await FetchInterface.getUserInfo();
	if (!user) {
		sendInSocket("game", "room", data.id, "error", "User not found");
		window.location.href = '/';
		return;
	}
	sessionStorage.removeItem("gameType");
	fadeOut();
	setTimeout(async () => {
		const main_container = document.querySelector<HTMLDivElement>('#app')!;
		main_container.innerHTML = tournamentHtml(data);

		setupColorTheme(user.preferences.theme);
		translatePage(user.preferences.lang);
		window.scrollTo(0, 0);
		removeLoadingScreen();
		fadeIn();

	}, 250);

}


export function tournamentHtml(data: any) {
  // Dimensions fixes pour garantir l'alignement
  const boxWidth = 300;
  const boxHeight = 200;
  const boxGap = 60;
  const finalBoxWidth = 420;
  const containerWidth = 900;
  const containerHeight = 2 * boxHeight + boxGap + 80;

  // Positions absolues
  const match1Top = 40;
  const match2Top = match1Top + boxHeight + boxGap;
  const leftCol = 40;
  const finalTop = (match1Top + match2Top + boxHeight) / 2 - boxHeight / 2;
  const finalLeft = leftCol + boxWidth + 220;

  // Coordonnées pour SVG et points d'angle droit
  const match1 = { x: leftCol + boxWidth, y: match1Top + boxHeight / 2 };
  const match2 = { x: leftCol + boxWidth, y: match2Top + boxHeight / 2 };
  const finalX = finalLeft;
  const finalY = finalTop + boxHeight / 2;
  // Point d'arrêt horizontal (avant la verticale)
  const midX = finalX - 60;

  let finalPlayer1 = "?";
	let finalPlayer2 = "?";
  if (data.rooms[2] !== undefined) {
		finalPlayer1 = data.rooms[2][0].player_name;
		finalPlayer2 = data.rooms[2][1].player_name;
  }

	const winners = ["?", "?"];
	const winnerImages = ["/images/duckHappy.png", "/images/duckHappy.png"];
	if (data.rooms[0][0].win !== undefined || data.rooms[0][1].win !== undefined) {
		winners[0] = (data.rooms[0][0].win !== undefined) ? data.rooms[0][0].player_name : data.rooms[0][1].player_name;
		winnerImages[0] = (data.rooms[0][0].win !== undefined) ? data.rooms[0][0].avatar : data.rooms[0][1].avatar;
	} 
	if (data.rooms[1][0].win !== undefined || data.rooms[1][1].win !== undefined) {
		winners[1] = (data.rooms[1][0].win != undefined) ? data.rooms[1][0].player_name : data.rooms[1][1].player_name;
		winnerImages[1] = (data.rooms[1][0].win != undefined) ? data.rooms[1][0].avatar : data.rooms[1][1].avatar;
	}

  return `
	<div class="flex font-title text-6xl mt-4 mb-10 justify-center w-full items-center text-tertiary dark:text-dtertiary">
	  Tournament Matches
	</div>
	<div class="relative mx-auto" style="width:${containerWidth}px; height:${containerHeight}px;">
	  <svg class="absolute left-0 top-0 pointer-events-none" width="${containerWidth}" height="${containerHeight}" style="z-index:0">
		
		<!-- Match 1 -->
		<polyline points="${match1.x},${match1.y} ${midX},${match1.y} ${midX},${finalY} ${finalX},${finalY}" fill="none" stroke="#888" stroke-width="3" />
		<!-- Badge gagnant match 1 -->
		<rect x="${midX - 40}" y="${match1.y - 15}" width="80" height="30" rx="15" fill="#744FAC" stroke="#fff" stroke-width="2" />
		<text x="${midX}" y="${match1.y + 5}" text-anchor="middle" font-size="12" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">${truncateText(winners[0], 10)}</text>
		
		<!-- Match 2 -->
		<polyline points="${match2.x},${match2.y} ${midX},${match2.y} ${midX},${finalY} ${finalX},${finalY}" fill="none" stroke="#888" stroke-width="3" />
		
		<!-- Badge gagnant match 2 -->
		<rect x="${midX - 40}" y="${match2.y - 15}" width="80" height="30" rx="15" fill="#744FAC" stroke="#fff" stroke-width="2" />
		<text x="${midX}" y="${match2.y + 5}" text-anchor="middle" font-size="12" fill="#fff" font-family="Arial, sans-serif" font-weight="bold">${truncateText(winners[1], 10)}</text>
	  </svg>
	  <div class="absolute" style="top:${match1Top}px; left:${leftCol}px; width:${boxWidth}px; height:${boxHeight}px;">
		<div class="flex flex-col items-center bg-primary dark:bg-dprimary text-secondary dark:text-dtertiary border rounded-lg p-6 w-full min-h-[200px] shadow-lg">
		  <div class="font-title text-xl mb-2" translate="semi-finals1">Match actuel</div>
		  <div class="flex flex-row gap-2 justify-center items-center">
			<div class="flex flex-col items-center">
			  <img src=${data.rooms[0][0].avatar} alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${data.rooms[0][0].player_name}</span>
			</div>
			<span class="text-center text-md text-gray-400">vs</span>
			<div class="flex flex-col items-center">
			  <img src=${data.rooms[0][1].avatar} alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${data.rooms[0][1].player_name}</span>
			</div>
		  </div>
		</div>
	  </div>
	  <div class="absolute" style="top:${match2Top}px; left:${leftCol}px; width:${boxWidth}px; height:${boxHeight}px;">
		<div class="flex flex-col items-center bg-secondary dark:bg-dsecondary text-primary dark:text-dprimary border rounded-lg p-6 w-full min-h-[200px] shadow-lg">
			<div class="font-title text-xl mb-2" translate="semi-finals2">Match actuel</div>
		  <div class="flex flex-row gap-2 items-center">
			<div class="flex flex-col items-center">
			  <img src=${data.rooms[1][0].avatar} alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${data.rooms[1][0].player_name}</span>
			</div>
			<span class="text-center text-md text-gray-400">vs</span>
			<div class="flex flex-col items-center">
			  <img src=${data.rooms[1][1].avatar} alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${data.rooms[1][1].player_name}</span>
			</div>
		  </div>
		</div>
	  </div>
	  <div class="absolute" style="top:${finalTop}px; left:${finalLeft}px; width:${finalBoxWidth}px; height:${boxHeight}px;">
		<div class="flex flex-col items-center bg-primary dark:bg-dprimary text-secondary dark:text-dtertiary border rounded-lg p-6 w-full min-h-[200px] shadow-lg">
		  <div class="font-title text-xl mb-2" translate="final">Final</div>
		  <div class="flex flex-row gap-2 justify-center items-center">
			<div class="flex flex-col items-center">
				<img src=${winnerImages[0]} alt="Match Image" class="w-24 h-24 rounded-full mb-2">
				<span class="truncate">${finalPlayer1}</span>
			</div>
			<span class="text-center text-md text-gray-400">vs</span>
			<div class="flex flex-col items-center">
			  <img src=${winnerImages[1]} alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${finalPlayer2}</span>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  `;
}
