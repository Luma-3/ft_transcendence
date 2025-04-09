function selectorOptions(lang: string) {
	
	const all_langs = [{value: 'en', name: 'English'}, {value: 'fr', name: 'French'}, {value: 'es', name: 'Spanish'}];
	const predefine_lang = `<option class="bg-secondary text-primary dark:bg-dprimary dark:text-dtertiary font-title" value='${lang}'>${all_langs.find(langObj => langObj.value === lang)?.name}</option>`;

	const all_options = all_langs.map(langObj => {
		if (langObj.value !== lang) {
			 return `<option class="bg-secondary text-primary dark:bg-dprimary dark:text-dtertiary font-title" value='${langObj.value}'>${langObj.name}</option>`;
		}
			return '';
	}).join('');

	return `${predefine_lang}${all_options}`;
}

export function languageSelector() {
	const lang = sessionStorage.getItem('lang') || 'en'; 
	
	return `
		<div class='flex flex-row items-center justify-space-between'>
			<label for='language' translate="lang_choice" class="p-3 font-title">Choose a language :</label>
			<select name='language' id='language' class="font-title hover:cursor-pointer hover:ring-2 ring-secondary">
				${selectorOptions(lang)}
			</select>
		</div>
	`;
}