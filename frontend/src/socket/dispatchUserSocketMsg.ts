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
		return window.location.href = '/login';
	}
	const trad = await loadTranslation(myUser.preferences.lang);

	const user = await FetchInterface.getOtherUserInfo(data);
	if (user === undefined) {
		return alertTemporary("error", trad['user-undefined'], myUser.preferences.theme)
	}

	switch (action) {
		case 'add':
			alertNotificationsFriends("info", `${trad['new-friend-request']} ${user.username}`, "dark", true)
			break;
		case 'accept':
			alertTemporary("info", `${trad['your-friend-request-was-accepted']} ${user.username}`, "dark", true, true)
			// const friendDiv = document.getElementById("friends-div");
			// 	const friendsHtml = await friendsList();
			// 	if (friendDiv && friendsHtml) {
			// 			friendDiv.innerHTML = friendsHtml;
			// 	}
			break;
		default:
			break;
	}
	setTimeout(() => {
		updateAllLists();
	}, 1000);
}