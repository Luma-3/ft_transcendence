import { fetchApi } from "../api/fetch";
import { getUserInfo } from "../api/getterUser(s)";
import { API_PEOPLE } from "../api/routes";
import { alertTemporary } from "../components/ui/alert/alertTemporary";

export async function handleFriendRequest(target: HTMLElement, action: "send" | "accept") {

	const user = await getUserInfo();
	if (!user || user.status === "error") {
		return window.location.href = "/login";
	}
	
	const targetId = target.dataset.id;
	const response = await fetchApi(API_PEOPLE.FRIENDS + `/${targetId}`, {
		method: "POST",
		body: JSON.stringify({
			friendId: targetId,
		})
	});
	if (response.status === "error") {

		(action === "send") ? alertTemporary("error", "issues-with-friend-invitation", user.data!.preferences.theme, true) : alertTemporary("error", "issues-with-friend-acceptance", user.data!.preferences.theme, true);

		return;
	}
	(action === "send") ? alertTemporary("success", "friend-invitation-sent", user.data!.preferences.theme, true) : alertTemporary("success", "friend-invitation-accepted", user.data!.preferences.theme, true);
}

export async function sendRefuseInvitation(target: HTMLElement) {
	
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		return window.location.href = "/login";
	}

	const targetId = target.dataset.id;
	const response = await fetchApi(API_PEOPLE.PENDING + `/${targetId}`, {
		method: "DELETE",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		return alertTemporary("error", "issues-with-invitation-refused", user.data!.preferences.theme, true);
	}
	alertTemporary("success", "friend-invitation-refused", user.data!.preferences.theme, true);
}

export async function blockUser(target: HTMLElement) {
	console.log("blockUser target", target);
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		window.location.href = "/login";
		return;
	}
	const blockId = target.dataset.id;

	const response = await fetchApi(API_PEOPLE.BLOCKED + `/${blockId}`, {
		method: "POST",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		alertTemporary("error", "issues-with-user-blocked", user.data!.preferences.theme, true);
		return;
	}
	alertTemporary("success", "user-blocked", user.data!.preferences.theme, true);
}