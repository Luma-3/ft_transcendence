import { renderPage } from '../../renderers/renderPage'
import { fetchApi } from '../../api/fetch'
import { API_ROUTES } from '../../api/routes';
import { alertError } from '../../components/ui/alertError';
import { User } from '../../api/interfaces/User';

export async function verifPasswordAndRegisterUser() {
	
	const form = document.forms.namedItem("registerForm") as HTMLFormElement | null;
	if (!form) {
		return;
	}
	const formData = new FormData(form);
	const userdata = Object.fromEntries(formData) as Record<string, string>;

	if (!userdata.username || !userdata.password || !userdata.passwordVerif) {
		 renderPage('hacked');
		 return;
	}

	console.log(userdata);
	if (userdata.password !== userdata.passwordVerif) { 
		renderPage('register');
		alertError("passwords_dont_match");
		return;
	}

	const reponse = await fetchApi<User>(API_ROUTES.USERS.REGISTER,
		{method: "POST", credentials: "include", body: JSON.stringify(userdata)});
	if (reponse.status !== "success" ) {
		renderPage('register');
		alertError(reponse.message);
		return;
	}
	renderPage('dashboard');
	return;
}