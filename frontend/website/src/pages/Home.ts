import { languageSelector } from '../components/ui/languageSelector.ts';
import { animateButton } from '../components/ui/animateButton.ts';

function logo() {
	const theme = localStorage.getItem('theme') || 'dark';
	console.log(theme);
	return `
		<div class="flex w-3/4 justify-center items-center animate-fade-in-down">
			<img class="w-full h-full" src='/images/logo-${theme}-optimized.webp' alt='Transcenduck Logo'/>
		</div>`;
}

function divHomePage() {
	return `
		<div class='flex flex-col items-center justify-center h-screen space-y-5'>
			${logo()}
			${languageSelector()}
			${animateButton("loadLoginPage", "welcome", "get_started")}
		</div>`;
}

export default async function homePage() {
	const container = divHomePage();
	return container;
}