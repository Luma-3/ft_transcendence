import { languageSelectorHome } from '../components/ui/languageSelector.ts';
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
			${languageSelectorHome()}
			${animateButton("loadlogin", "get-started", `<img src='/images/duckHappy.png' class='w-20 h-20 mr-2' alt='Duck happy icon'>`)}
		</div>`;
}
			// ${animateButton("loadlogin", "welcome", "get-started")}

export default async function homePage() {
	const container = divHomePage();
	return container;
}