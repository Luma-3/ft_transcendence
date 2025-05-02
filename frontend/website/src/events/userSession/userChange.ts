import { API_ROUTES } from "../../api/routes";
import { alertChangePasword } from "../../components/ui/alert";
import { fetchApi } from "../../api/fetch";
import { User } from "../../api/interfaces/User";

export async function changeUserPassword() {

	const response = await alertChangePasword();
	console.log(response);
	return ;
}

import { alertTemporary } from "../../components/ui/alert"
import { loadTranslation } from "../../i18n/Translate";

async function messageUpdateUserInfo(status: string, lang: string, theme: string) {
	
	const trad = await loadTranslation(lang);
	const message = status === "success" ?  trad["User info updated"] :  trad["User info not updated"];
	alertTemporary(message, theme);
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

async function changeUserEmail(user: User) {
	const form = document.getElementById("changeUserInfo") as HTMLFormElement;
	const formData = new FormData(form);
	const data = {
		email: formData.get("email"),
	};
	const response = await fetchApi<User>(API_ROUTES.USERS.UPDATE_EMAIL, {
		method: 'POST',
		body: JSON.stringify(data.email),
	})
	if (response.status === "success") {
		messageUpdateUserInfo("error", user.lang, user.theme);
	} else {
		messageUpdateUserInfo("success", user.lang, user.theme);
	}
	
}

export async function changeUser(parameter : string) {
	
	const response = await fetchApi<User>(API_ROUTES.USERS.INFOS, {
		method: 'GET',
	})
	if (response.status === "error" || !response.data) {
		alertTemporary("Error while fetching user info", 'dark');
		return;
	}
	switch (parameter) {
		case "email":
			changeUserEmail(response.data);
			break;
		case "password":
			changeUserPassword();
			break;
		case "default":
			alertTemporary("Rien a enregister", response.data.theme);
	}
}