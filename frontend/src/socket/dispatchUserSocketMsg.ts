import { FetchInterface } from "../api/FetchInterface";
import { alertNotifications } from "../components/ui/alert/alertNotifications";
import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { loadTranslation } from "../controllers/Translate";
import { friendsList } from "../pages/Friends/Lists/friendsList";
import { notificationList } from "../pages/Friends/Lists/notificationsList";

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
			alertNotifications("info", `${trad['new-friend-request']} ${user.username}`, "dark", true)
			break;
		case 'accept':
			alertTemporary("info", `${trad['your-friend-request-was-accepted']} ${user.username}`, "dark", true, true)
			const friendDiv = document.getElementById("friends-div");
				const friendsHtml = await friendsList();
				if (friendDiv && friendsHtml) {
						friendDiv.innerHTML = friendsHtml;
				}
			break;
		default:
			break;
		}
		const targetDiv = document.getElementById("notifications-div");
		const notificationsHtml = await notificationList();
		if (targetDiv && notificationsHtml) {
			targetDiv.innerHTML = notificationsHtml;
		}
}

// function dispatchPending(action: string, userId: string) {
	
// 	switch (action) {
// 		case 'add':
// 			alertNotifications("info", `Pending request from user ${userId}`, "dark", true)
// 			break;
// 		case 'remove':
// 			alert(`Pending request removed from user ${userId}`);
// 			break;
// 		case 'accept':
// 			alert(`Pending request accepted from user ${userId}`);
// 			break;
// 		case 'refuse':
// 			alert(`Pending request refused from user ${userId}`);
// 			break;
// 		default:
// 			console.error(`Unknown pending action: ${action}`);
// 	}
// }

// function dispatchFriend(action: string, userId: string) {
// 	switch (action) {
// 		case 'remove':
// 			alert(`Friendship removed with user ${userId}`);
// 			break;
// 		default:
// 			console.error(`Unknown friend action: ${action}`);
// 	}
// }
