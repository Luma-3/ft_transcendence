import { renderPublicPage, renderPrivatePage, renderErrorPage } from '../../components/renderPage'
import { fetchApi } from '../../api/fetch'
import { API_ROUTES } from '../../api/routes';
import { alertPublic } from '../../components/ui/alert/alertPublic';
import { User } from '../../api/interfaces/User';

export async function verifPasswordAndRegisterUser() {
	
	const form = document.forms.namedItem("registerForm") as HTMLFormElement | null;
	if (!form) {
		return;
	}
	const formData = new FormData(form);
	const userdata = Object.fromEntries(formData) as Record<string, string>;

	if (!userdata.username || !userdata.password || !userdata.passwordVerif) {
		 renderErrorPage('400','400', "bad_request");
		 return;
	}

	if (userdata.password !== userdata.passwordVerif) { 
		alertPublic("passwords_dont_match", "error");
		renderPublicPage('register');
		return;
	}

	const reponse = await fetchApi<User>(API_ROUTES.USERS.REGISTER,
		{method: "POST", credentials: "include", body: JSON.stringify(userdata)});
	
	if (reponse.status !== "success") {
		alertPublic(reponse.message, "error");
		renderPublicPage('register');
		return;
	}
	renderPrivatePage('WelcomeYou');
	setTimeout(() => {
		renderPrivatePage('dashboard',true);
	}, 3200);
}