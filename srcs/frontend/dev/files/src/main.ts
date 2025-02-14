// import './style.css'

import { renderHomePage } from './pages/home'
import { renderLoginPage } from './pages/login'
import { renderRegister } from './pages/register'
import { translatePage } from './i18n/translate'
import { addAllEventListenOnPage } from './events/handler'
import { initGoogleClient , setupGoogleButton } from './components/google/google_init'

const main_container = document.querySelector<HTMLDivElement>('#app')!

function addToHistory(page: string, updateHistory: boolean = true) {
	
	localStorage.setItem('current_page', page)
	if (updateHistory)
		history.pushState({ page }, '', `/${page}`)
}

export function renderPage(page: string, updateHistory: boolean = true) {

	let page_content = ''
	
	switch(page) {
		case 'home':
			page_content = renderHomePage();
			break;
		case 'login':
			page_content = renderLoginPage();
			break;
		case 'register':
			page_content = renderRegister();
			break;
		default:
			page_content = renderHomePage();
			break;
	}
	addToHistory(page, updateHistory);
			
	main_container.style.visibility = 'hidden';
	
	main_container.innerHTML = page_content;
	
	//Seulement sur le login page
	// setupGoogleButton()
	//Add function pour mettre la bonne value sur le select

	translatePage(localStorage.getItem('lang') || 'en')
	
	setTimeout(() => {
		main_container.style.visibility = 'visible';
	  }, 10);
}

addAllEventListenOnPage(main_container);

document.addEventListener('DOMContentLoaded', () => {
	
	// initGoogleClient();
	console.log('DOMContentLoaded')	
	const page = localStorage.getItem('current_page') || 'home'
	renderPage(page, false)
});

window.addEventListener('popstate', (event) => { 
	const page = event.state?.page || 'home'
	renderPage(page, false)
});