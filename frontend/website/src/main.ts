import { renderPage } from './renderers/renderPage'
import { addAllEventListenOnPage } from './events/Handler'
import { fetchApi } from "./api/fetch"
import { User } from "./api/interfaces/User"
import { API_ROUTES } from "./api/routes"

const main_container = document.querySelector<HTMLDivElement>('#app')!

export function addToHistory(page: string, updateHistory: boolean = true) {
	localStorage.setItem('current_page', page)
	if (updateHistory && page !== history.state?.page) {
		history.pushState({ page }, '', `/${page}`)
	}
}

addAllEventListenOnPage(main_container);

// * Au chargement initial ou refresh de la page
// * On initialise le client Google
// * On affiche la page courante ou la page d'accueil par défaut avec un leger delai
document.addEventListener('DOMContentLoaded', async () => {
	
	const page =  window.location.pathname.substring(1) || 'home'
	
	if (page === 'home') {
		try {
			const verif = await fetchApi<User>(API_ROUTES.USERS.INFOS, {
				method: "GET",
				credentials: "include"
			});
			if (verif.status === "success" && verif.data) {
				return renderPage('dashboard');
			}
		} catch (error) {
			console.warn('Error fetching user data:', error);
		}
	}
	renderPage(page, false);
});

// * Au changement de page lors de l'utilisation du bouton back/forward
window.addEventListener('popstate', (event) => { 
	console.log('popstate')
	const page = event.state?.page || 'home'
	renderPage(page, false)
});