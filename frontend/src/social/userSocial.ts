import { fetchApi } from "../api/fetch";
import { getUserInfo } from "../api/getterUser(s)";
import { API_PEOPLE } from "../api/routes";
import { alertTemporary } from "../components/ui/alert/alertTemporary";

export async function sendInvitationToUser(target: HTMLElement) {
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		window.location.href = "/login";
		return;
	}
	const targetId = target.dataset.id;
	const targetUsername = target.dataset.username;
	
	const response = await fetchApi(API_PEOPLE.FRIENDS + `/${targetId}`, {
		method: "POST",
		body: JSON.stringify({
			friendId: targetId,
		})
	});
	if (response.status === "error") {
		alertTemporary("error", `Error while sending invitation to ${targetUsername}: ${response.message}`,  user.data!.preferences.theme);
		return;
	}
	alertTemporary("success", `Invitation sent to ${targetUsername}`, user.data!.preferences.theme);
	console.log("sendInvitationToUser response", response);
}

export async function blockUser(target: HTMLElement) {
	console.log("blockUser target", target);
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		window.location.href = "/login";
		return;
	}
	const blockId = target.dataset.id;
	const targetUsername = target.dataset.username;

	const response = await fetchApi(API_PEOPLE.BLOCKED + `/${blockId}`, {
		method: "POST",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		alertTemporary("error", `Error while blocking ${targetUsername}: ${response.message}`, user.data!.preferences.theme);
		return;
	}
	alertTemporary("success", `${targetUsername} has been blocked`, user.data!.preferences.theme);
	console.log("blockUser response", response);
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
		alertTemporary("error", `Error while refusing invitation: ${response.message}`, user.data!.preferences.theme);
		return;
	}
	alertTemporary("success", `Invitation refused`, user.data!.preferences.theme);
	console.log("sendRefuseInvitation response", response);
}