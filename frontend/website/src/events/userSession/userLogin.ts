import { renderPage } from '../../renderers/renderPage'
import { fetchApi } from '../../api/fetch';
import { User } from '../../api/interfaces/User';
import { API_ROUTES } from '../../api/routes';
import { alertError } from '../../components/ui/alertError';

export async function loginUser() {

	const form = document.forms.namedItem("LoginForm") as HTMLFormElement | null;
	if (!form) {
		return;
	}

	const formData = new FormData(form);
	const userdata = Object.fromEntries(formData) as Record<string, string>;

	if (userdata.username === "" || userdata.password === "") {
		return;
	}

	//requete vers backend
	const response = await fetchApi<User>(API_ROUTES.USERS.LOGIN,
			{method: "POST", credentials: "include", body: JSON.stringify(userdata)})
	
	if (response.status == "success") {
		renderPage('dashboard');
	} else {
		alertError("username_or_password_incorrect");
	}
   
	// if not connected : refresh log page
	// if connected : go to home
	// if (data === null) {
	//     renderPage('login')
	// }
	// console.log('fin du post', data);
	// renderPage('home');
	// window.alert("username or password incorrect")
}