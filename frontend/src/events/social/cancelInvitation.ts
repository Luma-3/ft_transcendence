import { fetchApi } from "../../api/fetch";
import { getUserInfo } from "../../api/getterUser(s)";
import { API_USER } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { renderErrorPage } from "../../controllers/renderPage";

export async function cancelFriendInvitation(target: HTMLElement) {
	
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		return renderErrorPage('401');
	}

	const response = await fetchApi(API_USER.SOCIAL.PENDING + `/${target.dataset.id}`, {
		method: "DELETE",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		return alertTemporary("error", "issues-with-invitation-cancelled", user.data!.preferences!.theme, true);
	}
	alertTemporary("success", "friend-invitation-cancelled", user.data!.preferences!.theme, true);
	target.parentElement?.remove();
}
