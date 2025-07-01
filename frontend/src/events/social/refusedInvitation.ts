import { fetchApi } from "../../api/fetch";
import { getUserInfo } from "../../api/getterUser(s)";
import { API_USER } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { allUsersList } from "../../pages/Friends/Lists/allUsersList";

export async function refuseFriendInvitation(target: HTMLElement) {
	
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		return window.location.href = "/login";
	}

	const targetId = target.dataset.id;
	const response = await fetchApi(API_USER.SOCIAL.NOTIFICATIONS + `/refuse/${targetId}`, {
		method: "DELETE",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		return alertTemporary("error", "issues-with-invitation-refused", user.data!.preferences!.theme, true);
	}
	
	alertTemporary("success", "friend-invitation-refused", user.data!.preferences!.theme, true);
	target.parentElement?.parentElement?.remove();
	document.getElementById("all-users-div")!.innerHTML = `${await allUsersList()}`;
}