import { languageSelector } from '../components/ui/languageSelector.ts';
import { homeButton } from '../components/ui/homeButton.ts';
import { languageCheckbox } from '../components/ui/languageCheckbox.ts';

function logo() {
	return `
  <div class="flex animate-fade-in-down">
		<img src='/images/logo.svg' alt='Transcenduck Logo'/>
    </div>
	`;
}

function divHomePage() {
  return `
    <div class='flex flex-col items-center justify-center h-screen space-y-4 backdrop-filter backdrop-blur-xs text-tertiary'>
      ${logo()}
      ${languageSelector()}
      ${languageCheckbox()}
      ${homeButton()}
    </div>
  `;
}

export function homePage() {
  const container = divHomePage();
  return container;
}