import { backButton } from "../components/ui/backButton";

function settingsLogo() {
	return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 mr-2 animate-spin">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
			</svg>`
}

function settingsTitle() {
	return `<div class="text-6xl p-7 font-title items-center justify-center motion-reduce:animate-pulse" translate="settings">Settings</div>`
}

function changeDefaultLang() {

	const all_langs = [
		"fr",
		"en",
		"es"]
	
	
	const labels = all_langs.map((lang) => {
		return `<div role="button" class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-secondary focus:bg-slate-100 active:bg-slate-100">
 					<label for="${lang}-changer" class="flex w-full cursor-pointer items-center px-3 py-2">
 					<div class="inline-flex items-center">
			
 					<label class="flex items-center cursor-pointer relative" for="check-vertical-list-group4">
 					<input type="radio" name="lang-selector" class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
 						id="${lang}-changer" name="langSelect"/>
 					</label>
					
 					<label class="cursor-pointer ml-2 text-slate-600 text-sm" for="check-vertical-list-group4">
					<img src="images/icons/${lang}.png" alt="${lang}" class="w-5 h-5 mr-2">
					</label>
 					</div>
 					</label>
 					</div>`
	}).join('')
	

	return `<div class="text-2xl p-7 font-title items-center justify-center motion-reduce:animate-pulse" translate="">Change default language</div>
				<div class="relative max-w-sm flex w-full flex-col rounded-xl bg-primary shadow">
				<nav class="flex min-w-[240px] flex-row gap-1 p-2">
				${labels}
				</div>
				</nav>
				</div>`
}


function renderSettingsPage() {
	return `<div class="flex flex-col items-center justify-center space-y-4 dark:text-dtertiary backdrop-filter backdrop-blur-xs pt-20">
				${settingsLogo()}
				${settingsTitle()}
				${changeDefaultLang()}
				${backButton()}
			</div>`
}

export function settingsPage() {
	return renderSettingsPage();
}
