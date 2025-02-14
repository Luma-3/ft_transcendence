import { renderPage } from '../../main'

export async function verifPasswordAndRegisterUser() {
	const username = document.forms["registerForm"]["newUsername"].value;
	const password = document.forms["registerForm"]["newPassword"].value;
	const passwordVerif = document.forms["registerForm"]["newPasswordVerif"].value;

	//requete verif username existe ou pas
	if (username === "")		{ renderPage('register') } // TODO : redirection page d'erreur et/ou page de redirection (tenter de modifier le code style "you have been hacked")
	if (password === "")		{ renderPage('register') }
	if (passwordVerif === "")	{ renderPage('register') }

	if (password !== passwordVerif) { 
		renderPage('register'); 
		document.forms["registerForm"]["newUsername"].value = username;
		return ; 
	}

	//requete vers backend
	let data = null;
	try {
		const response = await fetch('http://localhost:3000/api/user', {
			method: "POST",
			body: JSON.stringify({
				username: username,
				password: password
			}),
			headers: {
				"Content-type": "application/json"
			  }
		})
		data = await response.json();
	} catch (error) {
		console.error('Fetch error:', error);
	}
	console.log('fin du post', data);
	renderPage('home');
}
