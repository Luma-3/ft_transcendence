import { User } from '../api/interfaces/User';

/**
 * * Page de bienvenue lorsque l'utilisateur se connecte pour la première fois (Welcome)
 * * Ou sinon lorsqu'il se reconnecte (ReWelcome)
 */

const welcomeTemplate = `<div id="welcome-transition"
		class="flex flex-col h-screen w-screen font-title items-center justify-center text-white text-6xl transition-opacity duration-1000 opacity-0">
		<img src="/images/WelcomeLogo.png" alt="Bienvenue" class="w-40 mb-8 drop-shadow-lg" />
		***
		</div>`;
	

export default function welcomeYouPage(user: User) {
	const name = ' ' + user?.username;
	return welcomeTemplate.replace('***',`<div translate="welcome">Welcome!</div> <div> ${name} </div>` );

}

export function reWelcomeYouPage(user: User) {
	const name = ' ' + user?.username;
	return welcomeTemplate.replace('***',`<div class="flex flex-col justify-center items-center p-4">Content de te revoir</div> <div> ${name} </div>` );
}


/**
 * * Effet de fondu pour la page 
 * * fais plus tard dans le render pour traduire la page et d'avoir le contenu dans le DOM
 */
export function handleWelcomeYouPage() {

	const welcome = document.getElementById('welcome-transition');
	if (welcome) {
		setTimeout(() => { welcome.style.opacity = '1'; }, 100);
		setTimeout(() => { welcome.style.opacity = '0'; }, 2200);
	}
}