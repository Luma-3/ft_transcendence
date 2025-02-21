import { renderPage } from '../../main'

export async function loginUser() {
	const username = document.forms["loginForm"]["loginUsername"].value;
	const password = document.forms["loginForm"]["loginPassword"].value;

	//requete verif username existe ou pas
	if (username === "")		{ renderPage('login') } // TODO : redirection page d'erreur et/ou page de redirection (tenter de modifier le code style "you have been hacked")
	if (password === "")		{ renderPage('login') }

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
	// if not connected : refresh log page
	// if connected : go to home
	if (data === null) {
		renderPage('login')
	}
	console.log('fin du post', data);
	renderPage('home');
	window.alert("username or password incorrect")
}