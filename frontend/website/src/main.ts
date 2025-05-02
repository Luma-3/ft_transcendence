import { renderPage } from './renderers/renderPage'
import { addAllEventListenOnPage } from './events/Handler'
import { getUserInfo } from './api/getter'


const main_container = document.querySelector<HTMLDivElement>('#app')!

export function addToHistory(page: string, updateHistory: boolean = true) {
	if (updateHistory && page !== history.state?.page) {
		sessionStorage.setItem('backPage', history.state?.page)
		history.pushState({ page }, '', `/${page}`)
	}
}

addAllEventListenOnPage(main_container);

// * Au chargement initial ou refresh de la page
// * On initialise le client Google
// * On affiche la page courante ou la page d'accueil par défaut avec un leger delai
document.addEventListener('DOMContentLoaded', async () => {
	
	const page =  window.location.pathname.substring(1) || 'home'
	const publicPages = ['home', 'login', 'register']
	
	console.log('akjwdkjahwdkjahwdkjhawdk')
	const user = await getUserInfo();
	if (user.status === "success" && user.data) {
		if (publicPages.includes(page)) {
			return renderPage('dashboard', true, user.data);
		}
		return renderPage(page, false, user.data);
	}
	return renderPage(page, false);

});

// * Au changement de page lors de l'utilisation du bouton back/forward
window.addEventListener('popstate', (event) => { 
	const page = event.state?.page || 'home'
	renderPage(page, false)
});