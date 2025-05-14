import { API_ROUTES } from "../../api/routes";
import { alertChangePasword } from "../../components/ui/alert/alertChangePasswd";

export async function changeUserPassword() {

	const response = await alertChangePasword();
	console.log(response);
	return ;
}

import { alertTemporary } from "../../components/ui/alert/alertTemporary"
import { loadTranslation } from "../../i18n/Translate";
import { getUserInfo } from "../../api/getter";
import { patchUserInfo } from "../../api/updater";

async function messageUpdateUserInfo(status: string, lang: string, theme: string) {
	
	const trad = await loadTranslation(lang);
	const message = status === "success" ?  trad["user-infos-updated"] :  trad["user-infos-not-updated"];

	alertTemporary(status, message, theme);
}

// async function changeUserInfos() {

// 	const form = document.getElementById("changeUserInfo") as HTMLFormElement;
// 	const formData = new FormData(form);
// 	const data = {
// 		username: formData.get("username"),
// 		email: formData.get("email"),
// 	};
// 	const response = await fetchApi<User>(API_ROUTES.USERS.UPDATE_EMAIL, {
// 		method: 'POST',
// 		body: JSON.stringify(data.email),
// 	})
// 	if (response.status === "success") {
// 		alertTemporary("User info updated", theme);
// 	}
// }

// async function changeUserInfo z(user: User) {
// 	const form = document.getElementById("saveChangeBasicUserInfo") as HTMLFormElement;
	
// 	const formData = new FormData(form);
	
// 	const email = formData.get("email");
// 	console.log(email);
// 	const response = await fetchApi<User>(API_ROUTES.USERS.UPDATE_EMAIL, {
// 		method: 'PUT',
// 		body: '{"email": "' + email + '"}',
// 	})
	

// }

export async function changeUserNameEmail() {
	
	const response = await getUserInfo();
	if (response.status === "error" || !response.data) {
		alertTemporary("error", "Error while fetching user info", 'dark');
		return;
	}
	const user = response.data;
	const form = document.getElementById("saveChangeBasicUserInfo") as HTMLFormElement;
	const formData = new FormData(form);
	const data = {
		username: formData.get("username"),
		email: formData.get("email"),
	}
	//TODO : Update with the new API
	const updateResponse = await patchUserInfo(API_ROUTES.USERS.UPDATE_EMAIL, data);

	if (updateResponse.status === "success") {
		messageUpdateUserInfo("success", user.lang, user.theme);
	} else {
		messageUpdateUserInfo("error", user.lang, user.theme);
	}
	
	
}