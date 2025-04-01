// import './style.css'

import { renderPage } from './renderer/rendererPage'
import { addAllEventListenOnPage } from './events/handler'
import { initGoogleClient } from './components/google/google_init'

const main_container = document.querySelector<HTMLDivElement>('#app')!

export function addToHistory(page: string, updateHistory: boolean = true) {
	localStorage.setItem('current_page', page)
	if (updateHistory) {
		history.pushState({ page }, '', `/${page}`)
	}
}

addAllEventListenOnPage(main_container);

// * Au chargement initial ou refresh de la page
document.addEventListener('DOMContentLoaded', () => {
	
	initGoogleClient();
	console.log('DOMContentLoaded')
	const page =  window.location.pathname.substring(1) || 'home'
	renderPage(page, false)
});

// * Au changement de page lors de l'utilisation du bouton back/forward
window.addEventListener('popstate', (event) => { 
	const page = event.state?.page || 'home'
	renderPage(page, false)
});