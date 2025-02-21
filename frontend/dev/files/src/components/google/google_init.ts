declare var google: any;

function waitForGoogle() {
	const checkGoogle = () => {
		if (google && google.accounts && google.accounts.id) {
			return
		}
		setTimeout(checkGoogle, 100)
	}
	checkGoogle()
}


export function setupGoogleButton() {
	
	waitForGoogle()
	
	const localisation = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en'
	const container = document.getElementById('google_login')!
	
	google.accounts.id.renderButton(container, {
		theme: `filled_black`,
		size: 'large',
		shape: 'pill',
		locale: localisation,
	})
}

export function initGoogleClient() {
	waitForGoogle();
	google.accounts.id.initialize({
		client_id: '119862352582-9id39otgurluqrqblb7n4b9np4861hle.apps.googleusercontent.com',
		callback: (response: any) => {
			console.log(response)
		}
	})
}