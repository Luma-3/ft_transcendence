import { FetchInterface } from "../../api/FetchInterface";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { loadTranslation } from "../../controllers/Translate";
import { updateAllLists } from "../../pages/Friends/Lists/updatersList";

export async function cancelGameInvitation(data: any) {
	const user = await FetchInterface.getOtherUserInfo(data);
	//TODO: Traduction
	await alertTemporary("info", "Game invitation to " + user?.username + " canceled", true);
	const createGameButton = document.getElementById('initGame');
	if (!createGameButton) {
		return;
	}
	if (createGameButton?.classList.contains('opacity-0')) {
		createGameButton.classList.replace('opacity-0', 'opacity-100');
		createGameButton.classList.remove('pointer-events-none');
	}

	updateAllLists();
}


export async function refuseGameInvitation(data: any) {
	const user = await FetchInterface.getOtherUserInfo(data);
	if (!user) {
		return;
	}
	const trad = await loadTranslation(user?.preferences.lang);
	const message = trad["game-invitation-to"] + " " + user?.username + " " + trad['refused'];
	alertTemporary("info", message, true);
	const createGameButton = document.getElementById('initGame');
	if (!createGameButton) {
		return;
	}
	if (createGameButton?.classList.contains('opacity-0')) {
		createGameButton.classList.replace('opacity-0', 'opacity-100');
		createGameButton.classList.remove('pointer-events-none');
	}
	updateAllLists();
}