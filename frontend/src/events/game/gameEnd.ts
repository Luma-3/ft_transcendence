import { FetchInterface } from "../../api/FetchInterface";
import { Button } from "../../classes/Button";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { backButton } from "../../components/ui/buttons/backButton";
import { navbar } from "../../components/ui/navbar";
import { translatePage } from "../../controllers/Translate";

export async function DisplayGameWinLose(data: any) {

  const user = await FetchInterface.getUserInfo();
  if (!user) {
    return await alertTemporary("error", "error-while-fetching-user-info", "dark", false, true);
  }

  const myId = user.id;
  let isWin = false;
  let winnerId = '';
  let winnerSide = 'right';
  let endDiv = '';
  for (const player of data.players) {
    if (player.id === myId && player.score === 5) {
      isWin = true;
      winnerSide = 'left';
      winnerId = player.id;
      break;
    }
  }
  if (data.type === 'local') {
    endDiv = `${navbar(user)}
	${backButton()}
	<div class="grid grid-cols-2 gap-4 h-full w-full items-center justify-center">
		${(winnerSide === 'left') ? gameWinContainer() + gameLoseContainer() : gameLoseContainer() + gameWinContainer()}
	</div>`

    const EndButton = new Button('loaddashboard', "1/2", 'Back to Dashboard', 'back-to-dashboard', 'secondary', 'button');

    endDiv += `<div class="flex space-y-4 justify-center items-center w-full h-full p-4">
		${EndButton.primaryButton()}
	</div>`
  } else {
    endDiv = `${navbar(user)}
		${backButton()}
		<div class="flex flex-col w-full items-center justify-center">
			${(isWin) ? gameWinContainer() : gameLoseContainer()}
		</div>`;

    const EndButton = new Button('loaddashboard', "1/2", 'Back to Dashboard', 'back-to-dashboard', 'secondary', 'button');

    endDiv += `<div class="flex space-y-4 justify-center items-center w-full h-full p-4">
			${EndButton.primaryButton()}
		</div>`;
  }


  const game = document.getElementById("hiddenGame") as HTMLDivElement;
  game.classList.replace("opacity-100", "opacity-0");
  setTimeout(() => {
    game.classList.add("hidden");
    document.getElementById("gameWin")!.innerHTML = endDiv;
    translatePage(user.preferences.lang);
  }, 500);


}
function gameWinContainer() {

  return `
<div class="flex flex-col justify-center items-center w-full h-full">
	<div class="flex flex-col items-center justify-center">
		<img src="/images/duckWin.png" alt="Duck Happy" class="w-140 h-140" />
		<div class="font-title text-8xl text-green-500 text-center font-bold mb-4" translate="you-win">
		You Win !
		</div>
	</div>

</div>`;
}

function gameLoseContainer() {

  return `
<div class="flex flex-col justify-center items-center w-full h-full">
	<div class="flex flex-col items-center justify-center">
		<img src="/images/duckLose.png" alt="Duck Sad" class="w-140 h-140" />
		<div class="font-title text-8xl text-center font-bold mb-4 text-red-500" translate="you-lose">
		You Lose !
		</div>
	</div>
</div>`;
}
