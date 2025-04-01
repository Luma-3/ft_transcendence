function renderLogo() {
	return `
		<img src='/logo.svg' alt='Transcenduck Logo' />
	`;
}

function renderLanguageSelector() {
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

function renderSaveLanguageCheckbox() {
	return `
		<div class='flex flex-row items-center p-3 justify-space-between'>
			<label for="save_lang" class='font-title text-lg p-4' for='theme' translate="save_choice">Save language</label>
			<input type='checkbox' id="save_lang" class="bg-black"/>
		</div>
	`;
}

function renderLoginButton() {
	return `
		<div class="flex items-center justify-center">
			<button id="loadLogin" class="flex w-1/4 bg-primary rounded-full items-center justify-center hover:cursor-pointer hover:ring-2 ring-secondary">
				<img src='/duck.png' class="invert flex w-1/4 py-2 pointer-events-none" alt='Transcenduck Logo' />
			</button>
		</div>
	`;
}

function divHomePage() {
  return `
    <div class='flex flex-col items-center justify-center h-screen space-y-4 backdrop-filter backdrop-blur-xs text-grey'>
      ${renderLogo()}
      ${renderLanguageSelector()}
      ${renderSaveLanguageCheckbox()}
      ${renderLoginButton()}
    </div>
  `;
}

export function homePage() {
  const container = divHomePage();
  return container;
}