import { renderPrivatePage, renderPublicPage } from './components/renderPage'
import { addAllEventListenOnPage } from './events/Handler'
import { fetchToken } from './api/fetchToken'

const main_container = document.querySelector<HTMLDivElement>('#app')!

import { gameLoop } from './pages/Game'

//* Ajout de la page dans l'historique de navigation et enregistrement de la page precedente pour le button back
export function addToHistory(page: string, updateHistory: boolean = true) {
	if (updateHistory && page !== history.state?.page) {
		sessionStorage.setItem('backPage', history.state?.page)
		history.pushState({ page }, '', `/${page}`)
	}
}

addAllEventListenOnPage(main_container);

const publicPages = ['home', 'login', 'register']

// * Au chargement initial ou refresh de la page
// * On verfie si l'utilisateur a une session active
// * On affiche la page prive si l'utilisateur est connecté
// * Sinon on affiche la page publique
document.addEventListener('DOMContentLoaded', async () => {
	
	if (gameLoop) {
		clearTimeout(gameLoop);
	}
	const page =  window.location.pathname.substring(1) || 'home'
	
	const user = await fetchToken();
	if (user.status === "success") {
		if (publicPages.includes(page)) {
			renderPrivatePage('dashboard', true);
			return ;
		}
		return renderPrivatePage(page, false);
	}
	return renderPublicPage(page);

});

// * Au changement de page lors de l'utilisation du bouton back/forward
window.addEventListener('popstate', (event) => { 
	const page = event.state?.page || 'home'
	if (publicPages.includes(page)) {
		return renderPublicPage(page);
	}
	return renderPrivatePage(page);
});