import { renderErrorPage, renderPrivatePage, renderPublicPage } from './controllers/renderPage'
import { addAllEventListenOnPage } from './controllers/Handler'
import { FetchInterface } from './api/FetchInterface'
import { loginTwoFaPage } from './pages/2FA'

const publicPages = ['home', 'login', 'register', 'verifyEmail']


const main_container = document.querySelector<HTMLDivElement>('#app')!
export async function renderBackPage() {
	window.history.go(-1);
}


//* Ajout de la page dans l'historique de navigation et enregistrement de la page precedente pour le button back
export function addToHistory(page: string, updateHistory: boolean = true) {
	if (updateHistory && page !== history.state?.page) {
		// Vérifier aussi que l'URL actuelle n'est pas déjà la même
		const currentPath = window.location.pathname.substring(1) || 'home';
		if (page !== currentPath) {
			history.pushState({ page }, '', `/${page}`);
		}
	}
}

addAllEventListenOnPage(main_container);

// * Au chargement initial ou refresh de la page
// * On verfie si l'utilisateur a une session active
// * On affiche la page prive si l'utilisateur est connecté
// * Sinon on affiche la page publique
document.addEventListener('DOMContentLoaded', async () => {

	const page = window.location.pathname.substring(1) || 'home'

	console.log(page);

	switch (page) {

		case 'error': 
			renderErrorPage(new URLSearchParams(window.location.search).get('status') || '500');
			break;

		case 'verifyEmail':
			await FetchInterface.verifyEmailUser(new URLSearchParams(window.location.search).get('value') || '');
			break;
		case '2FA':
			loginTwoFaPage();
			break;

		default: 
			const activeSession = await FetchInterface.verifySession();
			if (!activeSession) {
				return renderPublicPage(page);
			}
			(publicPages.includes(page)) 
			? window.location.href = '/dashboard' 
			: renderPrivatePage(page);
	}

});

// * Au changement de page lors de l'utilisation du bouton back/forward
window.addEventListener('popstate', (event) => {
	const page = event.state?.page || 'home'
	if (publicPages.includes(page)) {
		return renderPublicPage(page);
	}
	return renderPrivatePage(page);
});
