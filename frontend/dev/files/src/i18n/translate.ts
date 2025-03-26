// * Chargement des traductions
export async function loadTranslation() {
	const reponse = await fetch('/translation.json')
	return reponse.json()
	
}

export async function translatePage(lang : string = 'en') {
	
	const container = document.querySelector<HTMLDivElement>('#app')!
	
	const translations = await loadTranslation()
	if (!translations[lang]) {
		return
	}

	const elements = container.querySelectorAll('[translate]')

	elements.forEach(element => {
		const key = element.getAttribute('translate')
		if (key && translations[lang] && translations[lang][key])
		{
			if (element.tagName === 'INPUT')
			{
				(element as HTMLInputElement).placeholder = translations[lang][key]
			}
			else {
				element.innerHTML = translations[lang][key]
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
