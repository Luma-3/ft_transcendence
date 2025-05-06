import { renderPublicPage, renderPrivatePage, renderErrorPage } from '../../components/renderPage'
import { fetchApi } from '../../api/fetch'
import { API_ROUTES } from '../../api/routes';
import { alert } from '../../components/ui/alert/alert';
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
		renderPublicPage('register');
		alert("passwords_dont_match", "error");
		return;
	}

	const reponse = await fetchApi<User>(API_ROUTES.USERS.REGISTER,
		{method: "POST", credentials: "include", body: JSON.stringify(userdata)});
	if (reponse.status !== "success" ) {
		renderPublicPage('register');
		alert(reponse.message, "error");
		return;
	}
	renderPrivatePage('WelcomeYou');
	setTimeout(() => {
		renderPrivatePage('dashboard',true);
	}, 3200);
}