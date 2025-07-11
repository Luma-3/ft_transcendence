import { allUsersList } from "./allUsersList";
import { blockList } from "./blockList";
import { friendsList } from "./friendsList";
import { notificationList } from "./notificationsList";

export async function updateNotificationAlert() {
	const targetDiv = document.getElementById("notification-content");
	const notificationsHtml = await notificationList();
	if (targetDiv && notificationsHtml) {
		targetDiv.innerHTML = notificationsHtml;
	}
}


export async function updateNotificationsList() {
	const targetDiv = document.getElementById("notifications-div");
	const notificationsHtml = await notificationList();
	if (targetDiv && notificationsHtml) {
		targetDiv.innerHTML = notificationsHtml;
	}
}

export async function updateFriendsList() {
	const friendDiv = document.getElementById("friends-div");
	const friendsHtml = await friendsList();
	console.warn("Friends HTML:", friendsHtml);
	if (friendDiv && friendsHtml) {
		friendDiv.innerHTML = friendsHtml;
	}
}

export async function updateBlockList() {
	const blockDiv = document.getElementById("block-div");
	const blockHtml = await blockList();
	if (blockDiv && blockHtml) {
		blockDiv.innerHTML = blockHtml;
	}
}

export async function updateAllUserLists() {
	const allUserDiv = document.getElementById("all-users-div");
	const allUserHtml = await allUsersList();

	if (allUserDiv && allUserHtml) {
		allUserDiv.innerHTML = allUserHtml;
	}
}

export async function updateAllLists() {
	await updateNotificationsList();
	await updateFriendsList();
	await updateBlockList();
	await updateAllUserLists();
}
