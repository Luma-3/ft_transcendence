import { renderErrorPage, renderPrivatePage, renderPublicPage } from './controllers/renderPage'
import { addAllEventListenOnPage } from './controllers/Handler'
import { fetchToken } from './api/fetchToken'
import { verifyEmailUser } from './events/user/userVerif'


const main_container = document.querySelector<HTMLDivElement>('#app')!

//* Ajout de la page dans l'historique de navigation et enregistrement de la page precedente pour le button back
export function addToHistory(page: string, updateHistory: boolean = true) {
	if (updateHistory && page !== history.state?.page) {
		history.pushState({ page }, '', `/${page}`)
	}
}

addAllEventListenOnPage(main_container);

const publicPages = ['home', 'login', 'register'];

// * Au chargement initial ou refresh de la page
// * On verfie si l'utilisateur a une session active
// * On affiche la page prive si l'utilisateur est connecté
// * Sinon on affiche la page publique
document.addEventListener('DOMContentLoaded', async () => {

	const page = window.location.pathname.substring(1) || 'home'

	console.log(page);
		
	switch (page) {
		
		case 'error':
			return renderErrorPage(new URLSearchParams(window.location.search).get('status') || '500');
			
		case 'verifyEmail':
			return verifyEmailUser(new URLSearchParams(window.location.search).get('value') || '');
			
		default: 
			const user = await fetchToken();
			if (user.status === "success") {
				if (publicPages.includes(page)) {
					return renderPrivatePage('dashboard', true);
				}
				return renderPrivatePage(page);
			}
			return renderPublicPage(page);
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
