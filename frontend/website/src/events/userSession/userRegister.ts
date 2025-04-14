import { renderPage } from '../../components/renderPage'
import { fetchApi } from '../../components/api/api'
import { API_ROUTES } from '../../components/api/routes';
import { alertError } from '../../components/ui/alertError';

export interface User {
	id: number;
	username: string;
	created_at: string;
}

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

	if (userdata.password !== userdata.passwordVerif) { 
		renderPage('register');
		alertError("passwords_dont_match");
		return;
	}

	await fetchApi<User>(API_ROUTES.USERS.REGISTER,
		{method: "POST", credentials: "include", body: JSON.stringify(userdata)});
	
	renderPage('dashboard');
	return;
}