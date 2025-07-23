import { FetchInterface } from "../api/FetchInterface";
import { alertNotificationsFriends } from "../components/ui/alert/alertNotificationsFriends";
import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { loadTranslation } from "../controllers/Translate";
import { updateAllLists } from "../pages/Friends/Lists/updatersList";

export interface PayloadUserSocketMsg {
	type: 'pending' | 'friend';
	action: string;
	data: string; // is userId
}

export async function dispatchUserSocketMsg(payload: PayloadUserSocketMsg) {
	const { type, action, data } = payload;

	const myUser = await FetchInterface.getUserInfo();
	if (myUser === undefined) {
		return;
	}
	const trad = await loadTranslation(myUser.preferences.lang);

	const user = await FetchInterface.getOtherUserInfo(data);
	if (user === undefined) {
		return alertTemporary("error", trad['user-undefined'], true)
	}

	switch (action) {
		case 'add':
			alertNotificationsFriends("info", `${trad['new-friend-request']} ${user.username}`, 5000)
			break;
		case 'accept':
			alertTemporary("info", `${trad['your-friend-request-was-accepted']} ${user.username}`, true);
			break;
		default:
			break;
	}
	setTimeout(() => {
		updateAllLists();
	}, 1000);
}