import { Button } from "../../classes/Button";

function selectorOptions(lang: string) {
	
	const all_langs = [
		{value: 'en', name: 'English'},
		{value: 'fr', name: 'French'},
		{value: 'es', name: 'Spanish'}
	];

	const langAlreadySelected = localStorage.getItem('lang') || 'en';
	
	const predefine_lang = `<option class="font-title"
							value='${langAlreadySelected}'>${all_langs.find(langObj => langObj.value === langAlreadySelected)?.name}
							</option>`;

	const all_options = all_langs.map(langObj => {
		if (langObj.value !== lang) {
			return `<option class="font-title rounded-lg"
			value='${langObj.value}'>${langObj.name}</option>`;
		}
		return '';
	}).join('');

	return `${predefine_lang}${all_options}`;
}

export function languageSelectorHome() {

	const lang = localStorage.getItem('lang') || 'en';

return `
<div class="flex flex-col items-center font-title justify-center mt-5 mb-15 space-y-2 text-secondary dark:text-dtertiary">
	<div class='flex flex-row text-responsive-size items-center justify-space-between'>
		<label for='language' translate="lang-choice" class="p-3 font-title text-secondary dark:text-dtertiary">
			Choose a language :
		</label>
		<select name='language' id='language'
		class="rounded-lg p-1 font-title
			bg-tertiary dark:bg-dprimary text-secondary dark:text-dtertiary
			hover:cursor-pointer hover:ring-2 ring-tertiary dark:ring-dsecondary">
			${selectorOptions(lang)}
			</select>
		</div>
		<div class="flex flex-col justify-center items-center min-w-[200px]" translate="warning-language-default">
			This language will be set as the default for navigation and your first login
		</div>
</div>`;
}


export function languageSelectorSettings(langPreselect: string) {

	const all_langs = ["fr", "en", "es"];
	const saveLangButton = new Button("saveLang", "3/4", "Save", "save", "secondary", "button");
	
	const labels = all_langs.map((lang) => {

		const isChecked = (lang === langPreselect) ? 'checked' : ''

		return `<div role="button" class="group/item flex w-full justify-center items-center rounded-lg p-0 transition-all
		hover:bg-tertiary hover:dark:bg-dsecondary focus:bg-slate-100 active:bg-slate-100 relative peer-checked:border-2
		peer-checked:border-tertiary dark:border-dsecondary">
		
			<label for="${lang}-changer" class="flex w-full cursor-pointer justify-center items-center px-3 py-2">
			
			<img src="icons/${lang}head.png" alt="${lang}" class="max-w-[70px] rounded-full saturate-200" />
			<span class="tooltip absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover/item:block bg-primary text-tertiary dark:bg-dprimary 
			dark:text-dtertiary text-xs rounded py-1 px-2 z-10">
			<img src="icons/${lang}.webp" alt="${lang}" class="max-w-[20px] rounded-full saturate-200" />
			</span>
			<input type="radio" name="lang-selector" class="absolute peer h-5 w-5 cursor-pointer transition-all appearance-none"
			id="${lang}-changer" data-lang="${lang}" ${isChecked}"/>
			</label>
			</div>`
		}).join('')

	return `<div class="title-responsive-size p-2 font-title items-center justify-center motion-reduce:animate-pulse" translate="change-default-language">Change default language</div>
				<div class="flex flex-col w-full max-w-[800px] rounded-xl bg-primary dark:bg-dprimary shadow">
				<nav class="flex flex-col md:flex-row  w-full gap-1 p-2">
				${labels}
				<div class="flex justify-center items-center min-w-[200px]">
				${saveLangButton.secondaryButton()}
				</div>
				</div>
				</nav>`
}