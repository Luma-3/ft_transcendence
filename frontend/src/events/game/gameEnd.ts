import { FetchInterface } from "../../api/FetchInterface";
import { Button } from "../../classes/Button";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { translatePage } from "../../controllers/Translate";
import { IPlayer } from "../../interfaces/IGame";

export async function DisplayGameWinLose(players: IPlayer[]) {

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return await alertTemporary("error", "error-while-fetching-user-info", "dark");
	}
	const myId = user.id;
	let isWin = false;
	for (const player of players) {
		if (player.id === myId && player.win === true) {
			isWin = true;
			break;
		}
	}
	const game = document.getElementById("hiddenGame") as HTMLDivElement;
	game.classList.replace("opacity-100", "opacity-0");
	setTimeout(() => {
		console.log("Game ended, displaying win/lose screen");
		game.classList.add("hidden");
		document.getElementById("gameWin")!.innerHTML = isWin ? gameWinContainer() : gameLoseContainer();
		translatePage(user.preferences.lang);
	}, 500);

	
}
//TODO: Traduction
function gameWinContainer() {
	const backButton = new Button('loaddashboard', "1/2", 'Back to Dashboard', 'back-to-dashboard', 'secondary', 'button');
return `
<div class="flex flex-col justify-center items-center">
	
	<div class="flex flex-col items-center justify-center mt-20">
		<img src="/images/duckHappy.png" alt="Duck Happy" class="w-140 h-140" />
		<div class="font-title text-8xl text-center font-bold mb-4" translate="you-win">
		
		You Win !
		
		</div>
	</div>

	<div class="flex flex-col space-y-4 justify-center items-center w-full h-full p-4">
		${backButton.primaryButton()}
	</div>
</div>`;
}
//TODO: Traduction
function gameLoseContainer() {
	
	const backButton = new Button('loaddashboard', "1/2", 'Back to Dashboard', 'back-to-dashboard', 'secondary', 'button');
return `
<div class="flex flex-col justify-center items-center">

	<div class="flex flex-col items-center justify-center mt-20">
		<img src="/images/duckSad.png" alt="Duck Sad" class="w-140 h-140" />
		<div class="font-title text-8xl text-center font-bold mb-4 text-red-500" translate="you-lose>
		
		You Lose !
		
		</div>
	</div>

	<div class="flex flex-col space-y-4 justify-center items-center w-full h-full p-4">

		${backButton.primaryButton()}
	</div>

</div>`;
}