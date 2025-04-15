import { languageSelector } from '../components/ui/languageSelector.ts';
import { homeButton } from '../components/ui/homeButton.ts';


function logo() {
	const theme = localStorage.getItem('theme') || 'dark';
	return `
	<div class="flex animate-fade-in-down">
		<img class="w-400 h-full" src='/images/logo-${theme}.webp' alt='Transcenduck Logo'/>
		</div>
	`;
}

function shouldShowLanguageSelector() {
	if (localStorage.getItem('lang') !== null) {
		return false;
	}
	return true;
}


function divHomePage() {
	return `
		<div class='flex flex-col items-center justify-center h-screen space-y-4 backdrop-filter backdrop-blur-xs text-primary dark:text-dtertiary'>
			${logo()}
			${shouldShowLanguageSelector() ? languageSelector() : ''}
			${homeButton()}
		</div>
	`;
}

export async function homePage() {

	const container = divHomePage();
	return container;
}