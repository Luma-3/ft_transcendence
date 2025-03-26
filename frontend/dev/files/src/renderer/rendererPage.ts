import { homePage } from '../pages/home'
import { loginPage } from '../pages/login'
import { registerPage } from '../pages/register'
import { addToHistory } from '../main'
import { translatePage } from '../i18n/translate'
import { setupGoogleButton } from '../components/google/google_init'


// * Associe chaque page à sa fonction de rendu
const rendererPage: {[key: string]: () => string} = {
	'home': homePage,
	'login': loginPage,
	'register': registerPage,
};

export function renderPage(page: string, updateHistory: boolean = true) {
	
	const main_container = document.querySelector<HTMLDivElement>('#app')!
	const rendererFunction = rendererPage[page] || homePage;
	const page_content = rendererFunction();
	
	addToHistory(page, updateHistory);
			
	main_container.style.visibility = 'hidden';
	main_container.innerHTML = page_content;
	
	if (page === 'login' || page === 'register') {
		setupGoogleButton()
	}

	translatePage(localStorage.getItem('lang') || 'en')
	
	setTimeout(() => {
		main_container.style.visibility = 'visible';
	  }, 10);
}