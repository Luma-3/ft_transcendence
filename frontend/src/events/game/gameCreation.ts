import { FetchInterface } from "../../api/FetchInterface";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { fadeIn, fadeOut } from "../../components/utils/fade";
import { removeLoadingScreen } from "../../components/utils/removeLoadingScreen";
import { setupColorTheme } from "../../components/utils/setColorTheme";
import { translatePage } from "../../controllers/Translate";
import { IUserInfo } from "../../interfaces/IUser";
import gameHtml from "../../pages/Game";
import { socket } from "../../socket/Socket";
import { onKeyDown, onKeyUp } from "./gameInput";
import { resizeCanvas } from "./utils/resizeCanvas";

export let g_game_type = '';

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

export async function createGame(data: any) {

	console.log("createGame:", data)

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return alertTemporary("error", "error-while-creating-game", "dark", false, true);
	}
	//TODO: game_type => gameType
	g_game_type = data.game_type;
	fadeOut();

	setTimeout(async () => {
		const main_container = document.querySelector<HTMLDivElement>('#app')!;
		await addListenerEvent(data, user);
		const newContainer = await gameHtml(data, user.id);
		if (!newContainer) return;

		main_container.innerHTML = newContainer;

		setupColorTheme(user.preferences.theme);
		translatePage(user.preferences.lang); 
		removeLoadingScreen();
		fadeIn();
	}, 250);
}

async function addListenerEvent(data: any, user: IUserInfo) {

	//TODO: Zoom To 100%
	// window.addEventListener('resize', resizeCanvas)

	onkeyup = (event) => {
		onKeyUp(event, user.id);
	}

	onkeydown = (event) => {
		const divGame = document.getElementById("hiddenGame") as HTMLDivElement;

		if (divGame.classList.contains("opacity-0")) {
			readyEventListener(data.id);
		}
		onKeyDown(event, user.id);
	}
}

