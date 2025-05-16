import { API_USER } from "../../api/routes";
import { alertChangePassword } from "../../components/ui/alert/alertChangePassword";

export async function changeUserPassword() {

	await alertChangePassword();
	return ;
}

import { alertTemporary } from "../../components/ui/alert/alertTemporary"
import { loadTranslation } from "../../i18n/Translate";
import { getUserInfo } from "../../api/getter";
import { patchUserInfo } from "../../api/updater";
import { renderPrivatePage } from "../../components/renderPage";

export async function changeUserNameEmail() {
	
	const response = await getUserInfo();
	if (response.status === "error" || !response.data) {
		alertTemporary("error", "Error while fetching user info", 'dark');
		return;
	}
	const trad = await loadTranslation(response.data.preferences.lang);
	const user = response.data;
	const form = document.getElementById("saveChangeBasicUserInfo") as HTMLFormElement;
	
	const formData = new FormData(form);
	const formEntry = Object.fromEntries(formData) as Record<string, string>;
	
	let dataEntry = {
		username: formEntry.username,
		email: formEntry.email,
	}
	
	if (user.username === dataEntry.username 
		&& user.email === dataEntry.email) {
		const message = trad["no-changes-detected"];
		alertTemporary("info", message, user.preferences.theme);
		return;
	}
	if (dataEntry.username !== user.username) {
		const updateResponse = await patchUserInfo(API_USER.UPDATE.USERNAME, dataEntry.username, "username");
		if (updateResponse.status === "error") {
			alertTemporary("error", updateResponse.message, user.preferences.theme);
			return;
		}
	}
	if (dataEntry.email !== user.email) {
		const updateResponse = await patchUserInfo(API_USER.UPDATE.EMAIL, dataEntry.email, "email");
		if (updateResponse.status === "error") {
			alertTemporary("error", updateResponse.message, user.preferences.theme);
			return;
		}
	}
	alertTemporary("success", trad["user-info-updated"], user.preferences.theme);
	renderPrivatePage('profile', false);
	return;
}