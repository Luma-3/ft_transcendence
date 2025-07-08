import { FetchInterface } from "../../api/FetchInterface";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { secondaryButton } from "../../components/ui/buttons/secondaryButton";
import { IPlayer } from "../../interfaces/IGame";

export async function DisplayGameWinLose(players: IPlayer[]) {

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return await alertTemporary("error", "error-while-fetching-user-info", "dark");
	}
	const myId = user.id;
	let isWin = false;
	for (const player of players) {
		if (player.user_id === myId && player.win === true) {
			isWin = true;
			break;
		}
	}

	const game = document.getElementById("hiddenGame") as HTMLDivElement;
	game.classList.replace("opacity-100", "opacity-0");
	setTimeout(() => {
		game.classList.add("hidden");
		document.getElementById("gameWin")!.innerHTML = isWin ? gameWinContainer() : gameLoseContainer();
	}, 500);

}

function gameWinContainer() {
return `
<div class="flex flex-col">
	
	<div class="flex flex-col items-center justify-center mt-20">
		<img src="/images/duckHappy.png" alt="Duck Happy" class="w-140 h-140" />
		<div class="font-title text-8xl text-center font-bold mb-4">
		
		You Win !
		
		</div>
	</div>

</div>

<div class="flex flex-col bottom-0 justify-center items-center w-full h-20 mt-20">
	<img src="/images/duckHandsUpSparkles.png" alt="Duck Hands Up Sparkles" class="w-40 h-40" />

	<div class="flex flex-col space-y-4 justify-center items-center w-full h-full p-4">
		${secondaryButton({id: 'loaddashboard', weight: "1/2", text: "Back to Dashboard", translate: "back-to-dashboard", type: "button"})}
	</div>
</div>`;
}

function gameLoseContainer() {
return `
<div class="flex flex-col">

	<div class="flex flex-col items-center justify-center mt-20">
		<img src="/images/duckSad.png" alt="Duck Sad" class="w-140 h-140" />
		<div class="font-title text-8xl text-center font-bold mb-4">
		
		You Lose !
		
		</div>
	</div>
</div>

<div class="flex flex-col bottom-0 justify-center items-center w-full h-20 mt-20">
	<img src="/images/duckSad2.png" alt="Duck Sad 2" class="w-40 h-40" />
	
	<div class="flex flex-col space-y-4 justify-center items-center w-full h-full p-4">
		${secondaryButton({id: 'loaddashboard', weight: "1/2", text: "Back to Dashboard", translate: "back-to-dashboard", type: "button"})}
	</div>
</div>`;
}