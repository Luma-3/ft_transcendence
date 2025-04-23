import { secondaryButton } from './secondaryButton'

export function changeDefaultLang() {

	const all_langs = [
		"fr",
		"en",
		"es"]
	
	const langPreselect = localStorage.getItem('lang') || sessionStorage.getItem('lang') || 'en';
	const labels = all_langs.map((lang) => {

		const isChecked = (lang === langPreselect) ? 'checked' : ''
		return `<div role="button" class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-tertiary hover:dark:bg-dsecondary focus:bg-slate-100 active:bg-slate-100">
					<label for="${lang}-changer" class="flex w-full cursor-pointer items-center px-3 py-2">
					<div class="inline-flex items-center">
			
					<label class="flex items-center cursor-pointer relative" for="check-vertical-list-group4">
					<input type="radio" name="lang-selector" class="peer h-5 w-5 cursor-pointer transition-all
					 appearance-none rounded shadow hover:shadow-md border
					  border-slate-300 checked:bg-slate-800 checked:border-slate-800"
					id="${lang}-changer" name="langSelect" ${isChecked} onchange="changeLanguage('${lang}')"/>
					</label>
					
					<label class="cursor-pointer ml-2 text-slate-600 text-sm" for="check-vertical-list-group4">
					<img src="icons/${lang}.png" alt="${lang}" class="w-5 h-5 mr-2">
					</label>
					</div>
					</label>
					</div>`
	}).join('')
	

	return `<div class="text-2xl p-2 font-title items-center justify-center motion-reduce:animate-pulse" translate="change-default-language">Change default language</div>
				<div class="relative sm:w-full md:w-1/2 flex flex-col rounded-xl bg-primary dark:bg-dprimary shadow">
				<nav class="flex min-w-[340px] w-full flex-row gap-1 p-2">
				${labels}
				${secondaryButton({id: 'saveLang',weight: "1/2", text: 'Save', translate: 'saveLang', type: 'button'})}
				</div>
				</nav>`
}