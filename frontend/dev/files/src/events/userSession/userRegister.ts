import { renderPage } from '../../main'
import { fetchApi } from '../../api'
import { API_ROUTES } from '../../routes';

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

	console.log('formData: ', formData);
	console.log('userdata: ', userdata.password);
	//requete verif username existe ou pas
	if (!userdata.username || !userdata.password || !userdata.passwordVerif) {
		 renderPage('register');
		 return;
	} // TODO : redirection page d'erreur et/ou page de redirection (tenter de modifier le code style "you have been hacked")

	if (userdata.password !== userdata.passwordVerif) { 
		renderPage('register'); 
		form["newUsername"].value = userdata.username;
		return ;
	}

	const newToken = await fetchApi<Token>(API_ROUTES.USERS.REGISTER, {method: "POST", body: JSON.stringify(userdata)});
	if (newToken.success) {
		if (newToken.data)
			localStorage.setItem('token', newToken.data.token);
	}
	else {
		window.alert(newToken.error?.details);
		renderPage('home');
	}
	const token = localStorage.getItem('token');
	const response = await fetchApi<User>(API_ROUTES.USERS.DECODE, {
																	method: "GET",
																	headers: { "Authorization": `Bearer ${token}`}});
	if (response.data) {
		window.alert(`Welcome ${response.data.username}!`);
	}
	else {
		window.alert("coucou " + response.error?.details);
		renderPage('register');
	}
}

// const response = await fetch(getRoute('login'), {
// 	method: "POST",
// 	body: JSON.stringify({
// 		username: username,
// 		password: password
// 	}),
// 	headers: {
// 		"Content-type": "application/json"
// 	  }
// })
// data = await response.json();