import { renderPrivatePage, renderPublicPage } from './components/renderPage'
import { addAllEventListenOnPage } from './events/Handler'
import { getUserInfo } from './api/getter'


const main_container = document.querySelector<HTMLDivElement>('#app')!
const publicPages = ['home', 'login', 'register']

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
	const user = await getUserInfo();
	if (user.status === "success" && user.data) {
		if (publicPages.includes(page)) {
			renderPrivatePage('reWelcomeYou', false);
			setTimeout(() => {
				renderPrivatePage('dashboard', true);
			}, 3200);
			return;
		}
		return renderPrivatePage(page, false);
	}
	console.log('user not found');
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