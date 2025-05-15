import { renderPrivatePage, renderErrorPage } from '../../components/renderPage'
import { fetchApi } from '../../api/fetch'
import { API_USER, API_SESSION } from '../../api/routes';
import { alertPublic } from '../../components/ui/alert/alertPublic';
import { User } from '../../api/interfaces/User';
import { verifRegexPassword } from '../../components/utils/regex';

function error(message: string) {
	alertPublic(message, "error");
	return;
}

function verifValueForm(userData: Record<string, string>) {
	if (!userData.username || !userData.password || !userData.passwordVerif) {
		renderErrorPage('400','400', "bad_request");
		return false;
	}
	if (userData.password !== userData.passwordVerif) { 
		error("passwords_dont_match");
		return false;
	}
	return true;
}

export async function verifPasswordAndRegisterUser() {
	
	const form = document.forms.namedItem("registerForm") as HTMLFormElement | null;
	if (!form) {
		return;
	}
	const lang = sessionStorage.getItem('lang') || 'en';
	console.log("lang", lang);
	const formData = new FormData(form);
	const formEntry = Object.fromEntries(formData) as Record<string, string>;
	
	if (verifValueForm(formEntry) === false 
		|| verifRegexPassword(formEntry.password) === false) {
		return;
	}
	const userData = {
		username: formEntry.username,
		password: formEntry.password,
		passwordVerif: formEntry.passwordVerif,
		email: formEntry.email,
		preferences: {
			lang: lang,
		}
	}

	const response = await fetchApi<User>(API_USER.BASIC.REGISTER, {
		method: 'POST',
		body: JSON.stringify(userData)
	});
	if (response.status !== "success") {
		return error(response.message)
	}

	const sessionData = { username: userData.username, password:userData.password };
	const responseSession = await fetchApi(API_SESSION.CREATE, {
		method: "POST",
		body: JSON.stringify(sessionData)
	});
	if (responseSession.status !== "success") {
		return error(responseSession.message)
 	}

 	renderPrivatePage('WelcomeYou');
	setTimeout(() => {
		renderPrivatePage('dashboard',true);
	}, 3200);
}