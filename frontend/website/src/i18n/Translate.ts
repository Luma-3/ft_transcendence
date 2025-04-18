// * Chargement des traductions
export async function loadTranslation(lang: string) {
	const reponse = await fetch(`languages/${lang}.json`)
	return reponse.json()
	
}

export async function translatePage(lang : string = 'en') {

	if (lang !== 'en' && lang != 'fr' && lang != 'es') {
		return;
	}
	
	const container = document.querySelector<HTMLDivElement>('#app')!
	
	const translations = await loadTranslation(lang)

	const elements = container.querySelectorAll('[translate]')

	elements.forEach(element => {
		const key = element.getAttribute('translate')
		if (key && translations[key])
		{
			if (element.tagName === 'INPUT')
			{
				(element as HTMLInputElement).placeholder = translations[key]
			}
			else {
				element.innerHTML = translations[key]
			}
		}
	})
}

// * Changement de langue sur la Home page
export function changeLanguage(lang: string | undefined) {

	let language;

	if (!lang) {
		language = (document.getElementById('language') as HTMLSelectElement).value;
		sessionStorage.setItem('lang', language);
	} else {
		language = lang;
	}
	translatePage(language);
}

export function saveLanguage() {
	
	const choice = (document.getElementById('language') as HTMLSelectElement)
	if (choice === null) {
		return;
	}
	
	const lang_select = choice.value;
	if (lang_select !== 'en' && lang_select !== 'fr' && lang_select !== 'es') {
		return;
	}
	
	sessionStorage.setItem('lang', lang_select);
}

export function saveDefaultLanguage() {

	const choice = (document.querySelector('input[name="lang-selector"]:checked') as HTMLInputElement)
	const lang_select = choice.id.split('-')[0];

	if (lang_select !== 'en' && lang_select !== 'fr' && lang_select !== 'es') {
		return;
	}
	localStorage.setItem('lang', lang_select);
}
