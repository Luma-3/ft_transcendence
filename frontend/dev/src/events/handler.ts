import { changeLanguage } from '../i18n/translate'
import { renderPage } from '../components/RenderPage'
import { verifPasswordAndRegisterUser } from './userSession/userRegister'
import { loginUser } from './userSession/userLogIn'

const clickEvent: {[key: string]: () => void } = {
	'loadBackPage': () => window.history.back(),
	'loadLogin': () => renderPage('login'),
	'loadHome': () => renderPage('home'),
	'loadRegister': () => renderPage('register'),
};

const changeEvent: {[key: string]: () => void } = {
	'language': changeLanguage,
};

const submitEvent: {[key: string]: () => void } = {
	'registerForm': verifPasswordAndRegisterUser,
	'loginForm': loginUser,
};


export function addAllEventListenOnPage(container : HTMLDivElement) {
	container.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		
		if (target.id in clickEvent) {
			clickEvent[target.id]();
		}
		
	});
	
	container.addEventListener('change', (event) => {
		const target = event.target as HTMLElement;
		
		if (target.id in changeEvent) {
			changeEvent[target.id]();
		}
	});

	container.addEventListener('submit', (event) => {
		event.preventDefault();
		const target = event.target as HTMLElement;

		if (target.id in submitEvent) {
			submitEvent[target.id]();
		}
	})
}
