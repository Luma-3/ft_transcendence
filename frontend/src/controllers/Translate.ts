import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { FetchInterface } from "../api/FetchInterface";

const autorizedLangs = ['en', 'fr', 'es']

/**
* Chargement des traductions
*/
export async function loadTranslation(lang: string) {
	const reponse = await fetch(`languages/${lang}.json`)
	return reponse.json()

}

/**
* Traduction de la page en pacourant tout les elements avec l'attribut translate
* Verif si l'element est un input pour traduire le placeholder
*/
export async function translatePage(lang: string = 'en') {

	if (!autorizedLangs.includes(lang))
		lang = 'en'

	const container = document.querySelector<HTMLDivElement>('#app')!
	const footer = document.getElementById('footer')!

	const translations = await loadTranslation(lang)

	const elements = container.querySelectorAll('[translate]')

	elements.forEach(element => {
		const key = element.getAttribute('translate')
		if (key && translations[key]) {
			if (element.tagName === 'INPUT') {
				(element as HTMLInputElement).placeholder = translations[key]
			}
			else {
				element.innerHTML = translations[key]
			}
		}
	})

	const footerElements = footer.querySelectorAll('[translate]')
	footerElements.forEach(element => {
		const key = element.getAttribute('translate')
		if (key && translations[key]) {
			element.innerHTML = translations[key]
		}
	})
}

/**
* Changement de langue sur la Home page (Quand on a pas encore de preference pour le profil)
*/
export function changeLanguage(lang: string) {

	let language;
	if (!lang) {
		language = (document.getElementById('language') as HTMLSelectElement).value;
		localStorage.setItem('lang', language);
	} else {
		language = lang;
	}
	translatePage(language);
}

/** 
 * Changement de la langue lors de changement sur les checkbox sur la page settings
 */
export function changeLanguageSettings(dataset: DOMStringMap) {
	const lang = dataset.lang;
	if (lang) {
		changeLanguage(lang);
	}
}


/**
* Changement de langue sur la page settings avec preference user et verification si la langue est autorisée
*/
export async function saveLanguage(lang_select: string) {
	if (!autorizedLangs.includes(lang_select)) {
		alertTemporary("error", 'language-not-supported');
	}

	const user = await FetchInterface.getUserInfo();
	if (!user) {
		return;
	}

	const response = await FetchInterface.updatePreferences("lang", lang_select);
	if (!response) {
		return await alertTemporary("error", 'error-while-updating-language', true);
	}
	alertTemporary("success", 'language-update', true);
}


/**
* Fonction appelée lors du click sur le bouton sauvgarder (sur la page settings)
*/
export function saveDefaultLanguage() {

	const choice = (document.querySelector('input[name="lang-selector"]:checked') as HTMLInputElement)
	if (!choice) {
		return;
	}
	const lang_select = choice.id.split('-')[0];

	return saveLanguage(lang_select);
}
