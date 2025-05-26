export function DisplayGameWin(winnerMessage: string) {
	
	console.log("Game Win Displayed");
	
	const game = document.getElementById("hiddenGame") as HTMLDivElement;
	console.log(game);
	game.classList.remove("opacity-100");
	game.classList.add("opacity-0");
	setTimeout(() => {
		game.classList.add("hidden");
		document.getElementById("gameWin")!.innerHTML = gameWinContainer();
	}, 500);

}

import { primaryButton } from "../components/ui/buttons/primaryButton";
import { secondaryButton } from "../components/ui/buttons/secondaryButton";


function gameWinContainer() {
	return `<div class="flex flex-col">
	<div class="flex flex-col items-center justify-center h-full mt-20">
	<img src="/images/duckHappy.png" alt="Duck Happy" class="w-140 h-140" />
	<div class="font-title text-8xl text-center font-bold mb-4"> Michel Win !</div>
		</div>
	</div>
	<div class="flex flex-col bottom-0 justify-center items-center w-full h-20 mt-20">
	<img src="/images/duckHandsUpSparkles.png" alt="Duck Hands Up Sparkles" class="w-40 h-40" />
	<div class="flex flex-col space-y-4 justify-center items-center w-full h-full p-4">
	${primaryButton({id: 'playAgain', weight: "1/2", text: "Play Again", translate: "play-again", type: "button"})}
	${secondaryButton({id: 'backToDashboard', weight: "1/2", text: "Back to Dashboard", translate: "back-to-dashboard", type: "button"})}
	</div>

	

	</div>
	</div>`;
}

function gameLoseContainer() {
	return `<div class="flex flex-col">
	<div class="flex flex-col items-center justify-center h-full mt-20">
	<img src="/images/duckSad.png" alt="Duck Sad" class="w-140 h-140" />
	<div class="font-title text-8xl text-center font-bold mb-4"> You Lose !</div>
		</div>
	</div>
	<div class="flex flex-col bottom-0 justify-center items-center w-full h-20 mt-20">
	<img src="/images/duckSad2.png" alt="Duck Sad 2" class="w-40 h-40" />
	<div class="flex flex-col space-y-4 justify-center items-center w-full h-full p-4">
	${primaryButton({id: 'playAgain', weight: "1/2", text: "Play Again", translate: "play-again", type: "button"})}
	${secondaryButton({id: 'backToDashboard', weight: "1/2", text: "Back to Dashboard", translate: "back-to-dashboard", type: "button"})}
	</div>

	

	</div>
	</div>`;
}