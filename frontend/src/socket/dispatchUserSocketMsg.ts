import { getOtherUserInfo, getUserInfo } from "../api/getterUser(s)";
import { alertNotifications } from "../components/ui/alert/alertNotifications";
import { loadTranslation } from "../controllers/Translate";

export interface PayloadUserSocketMsg {
	type: 'pending' | 'friend';
	action: string;
	data: string; // is userId
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

export async function dispatchUserSocketMsg(payload: PayloadUserSocketMsg) {
	const { type, action, data } = payload;
	
	const user = await getUserInfo();
	const userFrom = await getOtherUserInfo(data);
	
	if (user.status === "success" && user.data) {
		let trad = await loadTranslation(user.data.preferences!.lang || 'en');
		let message = '';
		
		switch (action) {
		case 'add':
			message = trad['new-friend-request'];
			alertNotifications("info", `${message} ${userFrom.data?.username}`, "dark", true)
			break;
		case 'accept':
			alertNotifications("info", `${trad['your-friend-request-was-accepted']} ${userFrom.data?.username}`, "dark", true)
			break;
		default:
			break;
		}
	}
}
// case 'remove':
// 	message = trad['pending-request-removed-from-user'];
// 	alertNotifications("info", `${message} ${data}`, "dark", true)
// 	break;
// case 'refuse':
// 	alert(`Pending request refused from user ${data}`);
// 	break;
