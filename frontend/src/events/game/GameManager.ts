import { fadeIn, fadeOut } from "../../components/utils/fade";
import gameHtml from "../../pages/Game";
import { IGame, Game } from "./Game";
import { sendInSocket } from "../../socket/Socket";
import { FetchInterface } from "../../api/FetchInterface";
import { setupColorTheme } from "../../components/utils/setColorTheme";
import { translatePage } from "../../controllers/Translate";
import { removeLoadingScreen } from "../../components/utils/removeLoadingScreen";
import { DisplayGameWinLose } from "./gameEnd";

export class GameManager {
	private static instance: Game | null = null;

	static async init(data: IGame) : Promise<void> {

		const user = await FetchInterface.getUserInfo();
		if (!user) {
			sendInSocket("game", "room", data.id, "error", "User not found");
			window.location.href = '/';
			return;
		}

		fadeOut();
		sessionStorage.removeItem("gameType");
		setTimeout(async () => {
			const main_container = document.querySelector<HTMLDivElement>('#app')!;
			main_container.innerHTML = await gameHtml(data, user.id);
			
			setupColorTheme(user.preferences.theme);
			translatePage(user.preferences.lang);
			window.scrollTo(0, 0);
			removeLoadingScreen();
			fadeIn();

			GameManager.instance = new Game(data, user.id);
		}, 250);
	}

	static getGame() {
		return this.instance;
	}

	static async addSnapshot(snapshot: any) {
		if (!GameManager.instance) {
			console.warn("Game instance not initialized");
			return;
		}
		GameManager.instance.addSnapshot(snapshot);
	}

	static async addScore(data: any) {
		if (!GameManager.instance) {
			console.warn("Game instance not initialized");
			return;
		}
		GameManager.instance.addScore(data);
		
	}

	static stop() {
		if (!GameManager.instance) {
			console.warn("Game instance not initialized");
			return;
		}
		GameManager.instance.end();
		GameManager.instance = null;
	}

	static async endGame(data: any) {
		if (!GameManager.instance) {
			console.warn("Game instance not initialized");
			return;
		}
		DisplayGameWinLose(data)
		GameManager.instance.end();
		GameManager.instance = null;
	}

}
