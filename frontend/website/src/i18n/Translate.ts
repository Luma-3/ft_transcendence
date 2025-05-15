import { API_USER } from "../api/routes";
import { fetchApi } from "../api/fetch";
import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { getUserInfo } from "../api/getter";

const autorizedLangs = ['en', 'fr', 'es']

// * Chargement des traductions
export async function loadTranslation(lang: string) {
	const reponse = await fetch(`languages/${lang}.json`)
	return reponse.json()
	
}

export async function translatePage(lang : string = 'en') {

	if (!autorizedLangs.includes(lang))
		lang = 'en'
	
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

export async function saveLanguage(lang_select: string) {
	
	if (autorizedLangs.includes(lang_select)) {
		alertTemporary("error",'Language not autorized', 'dark');
	}
	
	const user = await getUserInfo();
	if (user.status !== "success" || !user.data) {
		alertTemporary("error", 'Error while getting user info', 'dark');
		return;
	}
	//TODO : Update with the new API
	const response = await fetchApi(API_USER.UPDATE.PREF, {
		method: "PATCH",
		body: JSON.stringify({
			lang: lang_select,
		})
	});
	if (response.status !== "success") {
		alertTemporary("error",'Error while updating language' + response.message, 'dark');
		return;
	}

	alertTemporary("success", 'Language updated', user.data.theme);
}

export function saveDefaultLanguage() {

	const choice = (document.querySelector('input[name="lang-selector"]:checked') as HTMLInputElement)
	const lang_select = choice.id.split('-')[0];

	return saveLanguage(lang_select);
}
