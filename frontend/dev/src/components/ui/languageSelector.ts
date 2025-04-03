export function languageSelector() {
	return `
		<div class='flex flex-row items-center justify-space-between'>
			<label for='language' translate="lang_choice" class="p-3 font-title">Choose a language :</label>
			<select name='language' id='language' class="font-title hover:cursor-pointer hover:ring-2 ring-secondary">
				<option class="font-title bg-primary" value='en'></option>
				<option class="bg-primary text-grey font-title" value='en'>English</option>
				<option class="bg-primary text-grey font-title" value='fr'>French</option>
				<option class="bg-primary text-grey font-title" value='es'>Spanish</option>
			</select>
		</div>
	`;
}