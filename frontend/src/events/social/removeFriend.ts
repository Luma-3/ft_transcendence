import { fetchApi } from "../../api/fetch";
import { getUserInfo } from "../../api/getterUser(s)";
import { API_USER } from "../../api/routes";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { renderErrorPage } from "../../controllers/renderPage";
import { allUsersList } from "../../pages/Profile/allUsersList";

export async function unfriendUser(target: HTMLElement) {
	
	const user = await getUserInfo();
	if (!user || user.status === "error") {
		return renderErrorPage('401');
	}

	const response = await fetchApi(API_USER.SOCIAL.FRIENDS + `/${target.dataset.id}`, {
		method: "DELETE",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		return alertTemporary("error", "issues-with-friend-removal", user.data!.preferences!.theme, true);
	}
	
	alertTemporary("success", "friend-removed", user.data!.preferences!.theme, true);
	target.parentElement?.parentElement?.parentElement?.remove();
	document.getElementById("all-users-div")!.innerHTML = `${await allUsersList()}`;
}