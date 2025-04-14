import { languageSelector } from '../components/ui/languageSelector.ts';
import { homeButton } from '../components/ui/homeButton.ts';

function logo() {
	const theme = localStorage.getItem('theme') || 'dark';
  return `
  <div class="flex animate-fade-in-down">
		<img src='/images/logo-${theme}.webp' alt='Transcenduck Logo'/>
    </div>
	`;
}

function divHomePage() {
  return `
    <div class='flex flex-col items-center justify-center h-screen space-y-4 backdrop-filter backdrop-blur-xs text-primary dark:text-dtertiary'>
      ${logo()}
      ${languageSelector()}
      ${homeButton()}
    </div>
  `;
}

export function homePage() {

  const container = divHomePage();
  
  return container;
}