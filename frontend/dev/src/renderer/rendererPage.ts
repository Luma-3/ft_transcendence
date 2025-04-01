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
	
	main_container.classList.add('transition-opacity', 'duration-1500', 'ease-in-out');
	main_container.style.opacity = '0';
	
	main_container.innerHTML = page_content;
	
	translatePage(localStorage.getItem('lang') || 'en');
	
	if (page === 'login' || page === 'register') {
		setupGoogleButton();
	}
	if (updateHistory) {
		addToHistory(page, updateHistory);
	}
	
	void main_container.offsetWidth;

	main_container.style.opacity = '1';

	// main_container.classList.remove('opacity-0');
	// main_container.classList.add('opacity-100');
}