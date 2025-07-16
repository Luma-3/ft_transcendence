import { FetchInterface } from "../api/FetchInterface";
import { fadeIn, fadeOut } from "../components/utils/fade";
import { removeLoadingScreen } from "../components/utils/removeLoadingScreen";
import { setupColorTheme } from "../components/utils/setColorTheme";
import { translatePage } from "../controllers/Translate";
import { ITournamentInfo } from "../interfaces/IGame";
import { sendInSocket } from "../socket/Socket";

export async function initTournament(data: any) {
	const user = await FetchInterface.getUserInfo();
	if (!user) {
		sendInSocket("game", "room", data.id, "error", "User not found");
		window.location.href = '/';
		return;
	}

	fadeOut();
	setTimeout(async () => {
		const main_container = document.querySelector<HTMLDivElement>('#app')!;
		main_container.innerHTML = tournamentHtml(data, user.id);
		
		setupColorTheme(user.preferences.theme);
		translatePage(user.preferences.lang);
		window.scrollTo(0, 0);
		removeLoadingScreen();
		fadeIn();

	}, 250);

}


export function tournamentHtml(data: any, userId: string) {
	console.log("Rendering tournament matches", data);
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
	if (data.rooms[0][0].win !== undefined || data.rooms[0][1].win !== undefined) {
		winners[0] = (data.rooms[0][0].win !== undefined) ? data.rooms[0][0].player_name : data.rooms[0][1].player_name;
	} 
	if (data.rooms[1][0].win !== undefined || data.rooms[1][1].win !== undefined) {
		winners[1] = (data.rooms[1][0].win != undefined) ? data.rooms[1][0].player_name : data.rooms[1][1].player_name;
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
		<circle cx="${midX}" cy="${match1.y}" r="18" fill="#fff" stroke="#888" stroke-width="3" />
		<text x="${midX}" y="${match1.y + 6}" text-anchor="middle" font-size="20" fill="#744FAC" font-family="Arial">${winners[0]}</text>
		<!-- Match 2 -->
		<polyline points="${match2.x},${match2.y} ${midX},${match2.y} ${midX},${finalY} ${finalX},${finalY}" fill="none" stroke="#888" stroke-width="3" />
		<!-- Badge gagnant match 2 -->
		<circle cx="${midX}" cy="${match2.y}" r="18" fill="#fff" stroke="#888" stroke-width="3" />
		<text x="${midX}" y="${match2.y + 6}" text-anchor="middle" font-size="20" fill="#744FAC" font-family="Arial">${winners[1]}</text>
	  </svg>
	  <div class="absolute" style="top:${match1Top}px; left:${leftCol}px; width:${boxWidth}px; height:${boxHeight}px;">
		<div class="flex flex-col items-center bg-primary dark:bg-dprimary text-secondary dark:text-dtertiary border rounded-lg p-6 w-full min-h-[200px] shadow-lg">
		  <div class="font-title text-xl mb-2">Match actuel</div>
		  <div class="flex flex-row gap-2 justify-center items-center">
			<div class="flex flex-col items-center">
			  <img src="/images/duckHappy.png" alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${data.rooms[0][0].player_name}</span>
			</div>
			<span class="text-center text-md text-gray-400">vs</span>
			<div class="flex flex-col items-center">
			  <img src="/images/duckHappy.png" alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${data.rooms[0][1].player_name}</span>
			</div>
		  </div>
		</div>
	  </div>
	  <div class="absolute" style="top:${match2Top}px; left:${leftCol}px; width:${boxWidth}px; height:${boxHeight}px;">
		<div class="flex flex-col items-center bg-secondary dark:bg-dsecondary text-primary dark:text-dprimary border rounded-lg p-6 w-full min-h-[200px] shadow-lg">
		  <div class="flex flex-row gap-2 items-center">
			<div class="flex flex-col items-center">
			  <img src="/images/duckHappy.png" alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${data.rooms[1][0].player_name}</span>
			</div>
			<span class="text-center text-md text-gray-400">vs</span>
			<div class="flex flex-col items-center">
			  <img src="/images/duckHappy.png" alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${data.rooms[1][1].player_name}</span>
			</div>
		  </div>
		</div>
	  </div>
	  <div class="absolute" style="top:${finalTop}px; left:${finalLeft}px; width:${finalBoxWidth}px; height:${boxHeight}px;">
		<div class="flex flex-col items-center bg-primary dark:bg-dprimary text-secondary dark:text-dtertiary border rounded-lg p-6 w-full min-h-[200px] shadow-lg">
		  <div class="font-title text-xl mb-2">Final</div>
		  <div class="flex flex-row gap-2 justify-center items-center">
			<div class="flex flex-col items-center">
				<img src="/images/duckHappy.png" alt="Match Image" class="w-24 h-24 rounded-full mb-2">
				<span class="truncate">${finalPlayer1}</span>
			</div>
			<span class="text-center text-md text-gray-400">vs</span>
			<div class="flex flex-col items-center">
			  <img src="/images/duckHappy.png" alt="Match Image" class="w-24 h-24 rounded-full mb-2">
			  <span class="truncate">${finalPlayer2}</span>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  `;
}
