function selectorOptions(lang: string) {
	
	const all_langs = [
		{value: 'en', name: 'English'},
		{value: 'fr', name: 'French'},
		{value: 'es', name: 'Spanish'}
	];

	const langAlreadySelected = sessionStorage.getItem('lang') || 'en';
	
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

export function languageSelector() {

	const lang = sessionStorage.getItem('lang') || 'en';

	return `
		<div class='flex flex-row text-responsive-size items-center justify-space-between'>
			<label for='language' translate="lang_choice" class="p-3 font-title text-secondary dark:text-dtertiary">
				Choose a language :
			</label>
			<select name='language' id='language'
			class="rounded-lg p-1 font-title
				bg-tertiary dark:bg-dprimary text-secondary dark:text-dtertiary
				hover:cursor-pointer hover:ring-2 ring-tertiary dark:ring-dsecondary">
				${selectorOptions(lang)}
			</select>
		</div>`;
}