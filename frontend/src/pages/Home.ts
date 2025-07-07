import { languageSelectorHome } from '../components/ui/languageSelector.ts';
import { animateButton } from '../components/ui/buttons/animateButton.ts';

function divHomePage() {
return `
<div class='flex flex-col items-center justify-center mt-40 space-y-8'>

	<div class="flex w-3/4 justify-center items-center animate-fade-in-down">

		<img class="w-full" src='/images/logo-dark-optimized.svg' alt='Transcenduck Logo'/>

	</div>
	${languageSelectorHome()}
	${animateButton("loadlogin", "get-started", `<img src='/images/duckHappy.png' class='w-20 h-20 mr-2 pointer-events-none' alt='Duck happy icon'>`)}

</div>`;
}

export default async function homePage() {
	const container = divHomePage();
	return container;
}