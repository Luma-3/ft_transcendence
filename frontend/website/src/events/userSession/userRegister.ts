import { renderPage } from '../../components/renderPage'
import { fetchApi } from '../../components/api/api'
import { API_ROUTES } from '../../components/api/routes';
import { alertError } from '../../components/ui/alertError';

interface User {
	id: number;
	username: string;
	created_at: string;
}

export async function verifPasswordAndRegisterUser() {
	
	const form = document.forms.namedItem("registerForm") as HTMLFormElement;
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

	const user = await fetchApi<User>(API_ROUTES.USERS.REGISTER,
		{method: "POST", credentials: "include", body: JSON.stringify(userdata)});
	
		console.log(user);
		console.log("Cookies: ", document.cookie);

	const userinfo = await fetchApi<User>(API_ROUTES.USERS.DECODE + `${user.data?.id}`,
		{method: "GET", credentials: "include"});

		console.log(userinfo);
}