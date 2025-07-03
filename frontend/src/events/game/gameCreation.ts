import { getRoomInfos } from "../../api/getterGame";
import { getOtherUserInfo, getUserInfo } from "../../api/getterUser(s)";
import { API_CDN } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { fadeIn, fadeOut } from "../../components/utils/fade";
import { randomNameGenerator } from "../../components/utils/randomNameGenerator";
import { removeLoadingScreen } from "../../components/utils/removeLoadingScreen";
import { setupColorTheme } from "../../components/utils/setColorTheme";
import { translatePage } from "../../controllers/Translate";
import { IUserInfo } from "../../interfaces/IUser";
import gameHtml from "../../pages/Game";
import { socket } from "../../socket/Socket";
import { onKeyDown, onKeyUp } from "./gameInput";
import { resizeCanvas } from "./utils/resizeCanvas";

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

export default async function createGameHtml(roomId: string, user: IUserInfo) {

	/**
	 * Mise en place du listener sur la fenetre pour redimensionner le canvas si
	 * la fenetre est redimensionnee
	 */
	window.addEventListener('resize', resizeCanvas)

	onkeyup = (event) => {
		onKeyUp(event, user.id);
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
			readyEventListener(roomId);
		}
		/**
		 * Si le joueur a deja rejoint la Room, on envoie les evenements
		 * de deplacement au serveur
		 */
		onKeyDown(event, user.id);
	}


	/**
	 * Recuperation des tous les joueurs present dans le Room pour afficher
	 * tout les adversaires du joueur (tournois)
	 */
	const roomInfos = await getRoomInfos(roomId);

	const leftOpponentInfos = await getOtherUserInfo(roomInfos.data!.players[0].user_id);
	const rightOpponentInfos = (roomInfos.data!.players.length > 1 && roomInfos.data!.players[1].user_id !== "other")
		? await getOtherUserInfo(roomInfos.data!.players[1].user_id)
		: {
			data: {
				preferences: {
					avatar: `${API_CDN.AVATAR}/default.png`,
					banner: `${API_CDN.AVATAR}/default.png`
				},
				player_name: randomNameGenerator(),
			}
		};

		if (!leftOpponentInfos || !rightOpponentInfos) {
		
			return alertTemporary("error", "error-while-fetching-opponent-infos", user.preferences!.theme);
		}

		return gameHtml(roomInfos.data!, leftOpponentInfos.data as IUserInfo, rightOpponentInfos.data as IUserInfo);
}


export async function createGame(data: any) {

	let lang = 'en';
	let theme = 'dark';

	const user = await getUserInfo();
	if (user.status === "error" || !user.data) {
		return alertTemporary("error", "error-while-creating-game", "dark");
	}

	lang = user.data.preferences!.lang;
	theme = user.data.preferences!.theme;

	fadeOut();
	
	setTimeout(async () => {
		const main_container = document.querySelector<HTMLDivElement>('#app')!
		const newContainer = await createGameHtml(data.roomId, user.data!);
		if (!newContainer) {
			return;
		}

		main_container.innerHTML = newContainer;
		setupColorTheme(theme);

		translatePage(lang);

		removeLoadingScreen();

		fadeIn();
	}, 250);
}