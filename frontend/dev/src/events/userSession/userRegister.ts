import { renderPage } from '../../components/renderPage'
import { fetchApi } from '../../components/api/api'
import { API_ROUTES } from '../../components/api/routes';
import { alertError } from '../../components/ui/alertError';
interface Token {
	token: string;
}

interface User {
	id: number;
	username: string;
	token: string; //JWT token
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

	const newToken = await fetchApi<Token>(API_ROUTES.USERS.REGISTER,
		{method: "POST", body: JSON.stringify(userdata)});	
	
	if (newToken.data)
		localStorage.setItem('token', newToken.data.token);
	
	const token = localStorage.getItem('token');
	const response = await fetchApi<User>(API_ROUTES.USERS.DECODE, {
																	method: "GET",
																	headers: { "Authorization": `Bearer ${token}`}});
}