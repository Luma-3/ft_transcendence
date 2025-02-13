import { changeLanguage, saveLanguage } from '../i18n/translate'
import { renderPage } from '../main'

async function testAPI() {
	try {
        const response = await fetch('http://user_api:3000/api/user');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('fin testAPI', data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}  // CORS BlocK API Proxy

export function addAllEventListenOnPage(container : HTMLDivElement) {
	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		
		if (target.id === 'save_lang') {
			saveLanguage();
		} else if (target.id === 'loadLogin') {
			renderPage('login');
		} else if (target.id === 'loadHome') {
			renderPage('home');
		} else if (target.id === 'testAPI') {
			console.log('testAPI');
			testAPI();
		}
	});
	
	container.addEventListener('change', (event) => {
		const target = event.target as HTMLElement;
		if (target.id === 'language') {
			changeLanguage();
		}
	});
}