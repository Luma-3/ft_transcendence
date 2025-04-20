import { languageSelector } from '../components/ui/languageSelector.ts';
import { animateButton } from '../components/ui/animateButton.ts';

function logo() {
	const theme = localStorage.getItem('theme') || 'dark';
	return `
		<div class="flex w-3/4 justify-center items-center animate-fade-in-down">
			<img class="w-full h-full" src='/images/logo-${theme}-optimized.webp' alt='Transcenduck Logo'/>
		</div>`;
}

function divHomePage() {
	return `
		<div class='flex flex-col items-center justify-center h-screen'>
			${logo()}
			${languageSelector()}
			${animateButton("loadLoginPage", "welcome", "get_started")}
		</div>`;
}

export async function homePage() {
	const container = divHomePage();
	return container;
}