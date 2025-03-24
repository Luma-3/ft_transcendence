import { changeLanguage, saveLanguage, initLanguage } from '../i18n/translate'
import { renderPage } from '../main'
import { verifPasswordAndRegisterUser } from './userSession/userRegister'
import { loginUser } from './userSession/userLogIn'

export function addAllEventListenOnPage(container : HTMLDivElement) {
	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		
		switch(target.id) {
			case 'loadLogin':
				saveLanguage();
				renderPage('login');
				break;
			case 'loadHome':
				renderPage('home');
				break;
			case 'loadRegister':
				renderPage('register');
				break;
		}
	});
	
	container.addEventListener('change', (event) => {
		const target = event.target as HTMLElement;
		if (target.id === 'language') {
			changeLanguage();
		}
	});

	container.addEventListener('submit', (event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;

		switch(target.id) {
			case 'registerForm':
				verifPasswordAndRegisterUser();
				break;
			case 'loginForm':
				loginUser();
				break;
		}
	})
}
