import { LanguageSelector } from '../components/ui/language-selector.ts';
import { LoginButton } from '../components/ui/login-button.ts';
import { LanguageCheckbox } from '../components/ui/language-checkbox.ts';

function renderLogo() {
	return `
		<img src='/images/logo.svg' alt='Transcenduck Logo'/>
	`;
}

function divHomePage() {
  return `
    <div class='flex flex-col items-center justify-center h-screen space-y-4 backdrop-filter backdrop-blur-xs text-tertiary'>
      ${renderLogo()}
      ${LanguageSelector()}
      ${LanguageCheckbox()}
      ${LoginButton()}
    </div>
  `;
}

export function homePage() {
  const container = divHomePage();
  return container;
}