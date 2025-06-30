import { fetchApi } from "../../api/fetch";
import { getUserInfo } from "../../api/getterUser(s)";
import { API_USER } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { renderErrorPage } from "../../controllers/renderPage";

export async function friendRequest(target: HTMLElement, action: "send" | "accept") {

	const user = await getUserInfo();
	if (!user || user.status === "error") {
		return renderErrorPage('401');
		
	}

	const targetId = target.dataset.id;
	const response = await fetchApi(API_USER.SOCIAL.NOTIFICATIONS + `${(action == "send" ? "" : "/accept")}/${targetId}`, {
		method: "POST",
		body: JSON.stringify({
			friendId: targetId,
		})
	});
	
	if (response.status === "error") {
		return (action === "send") ? alertTemporary("error", "issues-with-friend-invitation", user.data!.preferences!.theme, true)
																: alertTemporary("error", "issues-with-friend-acceptance", user.data!.preferences!.theme, true);
	}

	(action === "send") ? alertTemporary("success", "friend-invitation-sent", user.data!.preferences!.theme, true) 
											: alertTemporary("success", "friend-invitation-accepted", user.data!.preferences!.theme, true);
	
	target.parentElement?.remove();
}
