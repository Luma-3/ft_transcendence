declare var google: any;

export function loadGoodLanguageGoogleScript(): Promise<void> {

	const lang = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en'

	return new Promise<void>((resolve, reject) => {
		const script = document.createElement('script');
		script.src = `https://accounts.google.com/gsi/client?client_id=119862352582-9id39otgurluqrqblb7n4b9np4861hle.apps.googleusercontent.com&lang=${lang}`;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error('Error loading Google script !'));
		document.head.appendChild(script);
	});
}

function waitForGoogle() {
	return new Promise<void>((resolve) => {
		const checkGoogle = () => {
			if (typeof google !== 'undefined' && google && google.accounts && google.accounts.id) {
				resolve();
			} else {
				setTimeout(checkGoogle, 100)
			}
		};
		checkGoogle()
	});
}

export function googleButton() {
	return `
	<button id="google_login" class=" items-center justify-center hover:cursor-pointer">
	</button>
	`;
}

export function setupGoogleButton() {
	const theme = localStorage.getItem('theme') || 'dark';
	const google_theme = theme === 'dark' ? 'filled_black' : 'outline'; 
	
	waitForGoogle().then(() => {	
		const localisation = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en'
		console.log('localisation: ', localisation)
		const container = document.getElementById('google_login')!
		
		google.accounts.id.renderButton(container, {
			theme: google_theme,
			size: 'small',
			shape: 'rectangular',
			locale: localisation,
		});
	});
}

export async function initGoogleClient() {
	waitForGoogle().then(() => {
		google.accounts.id.initialize({
			client_id: '119862352582-9id39otgurluqrqblb7n4b9np4861hle.apps.googleusercontent.com',
			callback: (response: any) => {
				console.log('response: ', response)
				registerUserWithGoogle(response)
			}
		});
	});
}

function registerUserWithGoogle(response: any) {
	const token = response.credential
	console.log('token: ', token)
}