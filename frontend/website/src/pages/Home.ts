import { languageSelector } from '../components/ui/languageSelector.ts';
import { animateButton } from '../components/ui/buttons/animateButton.ts';

function logo() {
	return `
		<div class="flex w-3/4 justify-center items-center animate-fade-in-down">
			<img class="" src='/images/logo-dark-optimized.webp' alt='Transcenduck Logo'/>
		</div>`;
}

function divHomePage() {
	return `
		<div class='flex flex-col items-center justify-center h-screen space-y-8'>
			${logo()}
			${languageSelector()}
			${animateButton("loadlogin", "welcome", "get-started")}
		</div>`;
}

export default async function homePage() {
	const container = divHomePage();
	return container;
}