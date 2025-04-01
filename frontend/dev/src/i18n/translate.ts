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
export function changeLanguage() {
	const language = (document.getElementById('language') as HTMLSelectElement).value
	sessionStorage.setItem('lang', language);
	translatePage(language);
}

export function saveLanguage() {
	const choice = (document.getElementById('save_lang') as HTMLInputElement)
	if (choice && choice.checked == true)
	{
		localStorage.setItem('lang', sessionStorage.getItem('lang') || 'en')
	}
}
