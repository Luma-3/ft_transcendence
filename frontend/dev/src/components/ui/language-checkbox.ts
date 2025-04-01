export function LanguageCheckbox() {
	return `
		<div class='flex flex-row items-center p-3 justify-space-between'>
			<label for="save_lang" class='font-title text-lg p-4' for='theme' translate="save_choice">Save language</label>
			<input type='checkbox' id="save_lang" class="bg-black"/>
		</div>
	`;
}