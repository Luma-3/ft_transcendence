import { homePage } from '../pages/Home'
import { loginPage } from '../pages/Login'
import { registerPage } from '../pages/Register'
import { addToHistory } from '../main'
import { translatePage } from '../i18n/translate'
import { setupGoogleButton } from './Google'


// * Associe chaque page à sa fonction de rendu
const rendererPage: {[key: string]: () => string} = {
	'home': homePage,
	'login': loginPage,
	'register': registerPage,
};

export function renderPage(page: string, updateHistory: boolean = true) {
	
	const main_container = document.querySelector<HTMLDivElement>('#app')!
	console.log('remove opacity-100')
	main_container.classList.remove('opacity-100')
	main_container.classList.add('opacity-0')
	
	setTimeout(() => {
		const rendererFunction = rendererPage[page] || homePage;
		const page_content = rendererFunction();

		main_container.innerHTML = page_content;

		if (page === 'login' || page === 'register') {
			setupGoogleButton();
		}
		if (updateHistory) {
			addToHistory(page, updateHistory);
		}
		
		translatePage(localStorage.getItem('lang') || 'en');
		}
	, 300);

	setTimeout(() => {
		console.log('remove opacity-0')
		main_container.classList.remove('opacity-0')
		main_container.classList.add('opacity-100')
	}
	, 300);
		

}