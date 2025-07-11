import { fetchApiWithNoError } from '../api/fetch';
import { API_2FA } from '../api/routes';
import { renderPrivatePage, renderPublicPage } from '../controllers/renderPage';

import { headerPage } from '../components/ui/headerPage';
import { primaryButton } from '../components/ui/buttons/primaryButton';
import { socketConnection } from '../socket/Socket';
import { alertPublic } from '../components/ui/alert/alertPublic';
import { FetchInterface } from '../api/FetchInterface';
import { alertTemporary } from '../components/ui/alert/alertTemporary';
import { Button } from '../classes/Button';


/** 
* ! Quand l'utilisateur clique sur le bouton id = 'enable2fa' 
*/
export async function enable2FA() {
	if (await FetchInterface.activate2FA()) {
		renderPublicPage('2FA');
	}
}

export async function disable2FA() {
	if (await FetchInterface.desactivate2FA()) {
		renderPublicPage('2FA');
	}
}

export async function submit2FACode() {
	console.log("submit2FACode called");
	const codeInput = document.getElementById('2faCodeInput') as HTMLInputElement;
	const code = codeInput.value.trim();
	if (!code) {
		return await alertPublic("error", "Please enter your 2FA code");
	}

	const response = await fetchApiWithNoError(API_2FA.SEND, {
		method: 'POST',
		body: JSON.stringify({ code })
	});
	if (response.status === 'error') {
		console.log("Error in 2FA code submission:", response.message);
		await alertTemporary("error", "Invalid 2FA code, please try again", 'dark', true);
		return;
	}

	alertPublic("success", response.message);
	setTimeout(async () => {
			await socketConnection();
			renderPrivatePage('dashboard');
		}, 1000);

}

export async function submit2FACodeLogin() {

	console.log("submit2FACode called");
	const codeInput = document.getElementById('2faCodeLoginInput') as HTMLInputElement;
	const code = codeInput.value.trim();
	if (!code) {
		return await alertPublic("error", "Please enter your 2FA code");
	}

	if (await FetchInterface.submit2FACode(code)) {
		renderPrivatePage('dashboard');
	}

}

/**
 * ! Contenu html de la page 2FA
 */
export default async function twoFaPage() {

	const formButton = new Button('submit2faCode', "1/4", 'Submit 2FA Code', 'submit-2fa-code','primary', 'submit' )
return `<div class="flex flex-col w-full h-full rounded-lg justify-center mt-30">

	${headerPage("2fa-auth", "private")}

	<div class="flex flex-col w-full h-full rounded-lg justify-center items-center mt-5 mb-10">

		<div class="flex font-title text-responsive-size justify-center w-1/2 items-center text-tertiary dark:text-dtertiary">
			<span translate="2fa-description">To secure your account, please enter the 2FA code received via email.</span>

		</div>

	</div>
	
	<div class="flex flex-col w-full justify-center items-center mb-80 space-y-10">

		<form id="2faCodeForm" class="flex flex-col w-full justify-center items-center space-y-8">
			<label class="text-responsive-size font-title text-tertiary dark:text-dtertiary text-center" translate="2fa-code">Enter your 6-digit 2FA code:</label>
			
			<div class="flex justify-center items-center space-x-3">
				<input type="text" id="digit1" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="digit2" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="digit3" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="digit4" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="digit5" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="digit6" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
			</div>
			
			<input type="hidden" id="2faCodeInput" name="2faCode" />
			
			${formButton.primaryButton()}
		</form>
	
	</div>
</div>`
}

export async function loginTwoFaPage() {
	const loginButton = new Button('login2faCode', "1/4", 'Submit 2FA Code', 'submit-2fa-code', 'primary', 'submit');
return `<div class="flex flex-col w-full h-full rounded-lg justify-center mt-30">

	${headerPage("2fa-auth", "private")}

	<div class="flex flex-col w-full h-full rounded-lg justify-center items-center mt-5 mb-10">

		<div class="flex font-title text-responsive-size justify-center w-1/2 items-center text-tertiary dark:text-dtertiary">
			<span translate="2fa-description">To secure your account, please enter the 2FA code generated by your authenticator app.</span>

		</div>

	</div>
	
	<div class="flex flex-col w-full justify-center items-center mb-80 space-y-10">

		<form id="2faCodeLoginForm" class="flex flex-col w-full justify-center items-center space-y-8">
			<label class="text-responsive-size font-title text-tertiary dark:text-dtertiary text-center" translate="2fa-code">Enter your 6-digit 2FA code:</label>
			
			<div class="flex justify-center items-center space-x-3">
				<input type="text" id="loginDigit1" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="loginDigit2" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="loginDigit3" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="loginDigit4" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="loginDigit5" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
				<input type="text" id="loginDigit6" maxlength="1" class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-600 text-tertiary dark:text-dtertiary rounded-lg focus:border-dprimary dark:focus:border-dsecondary focus:outline-none transition-colors duration-200 bg-white dark:bg-gray-800" inputmode="numeric" pattern="[0-9]" />
			</div>
			
			<input type="hidden" id="2faCodeLoginInput" name="2faCode" />

			${loginButton.primaryButton()}
		</form>
	
	</div>
</div>`
}

/**
 * Setup interactive behavior for 2FA digit inputs
 */
export function setup2FAInputs(prefix: string = '') {
	const digits: HTMLInputElement[] = [];
	for (let i = 1; i <= 6; i++) {
		const digit = document.getElementById(`${prefix}digit${i}`) as HTMLInputElement;
		if (digit) {
			digits.push(digit);
		}
	}

	digits.forEach((input, index) => {
		// Auto-focus to next field on input
		input.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			const value = target.value;

			// Only allow digits
			if (!/^\d$/.test(value)) {
				target.value = '';
				return;
			}

			// Update hidden input
			updateHiddenInput(prefix);

			// Move to next field
			if (value && index < digits.length - 1) {
				digits[index + 1].focus();
			}
		});

		// Handle backspace to move to previous field
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Backspace' && !input.value && index > 0) {
				digits[index - 1].focus();
			}
		});

		// Handle paste
		input.addEventListener('paste', (e) => {
			e.preventDefault();
			const pastedData = e.clipboardData?.getData('text') || '';
			const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
			
			if (numbers.length > 0) {
				// Fill the inputs with pasted numbers
				for (let i = 0; i < Math.min(numbers.length, digits.length); i++) {
					digits[i].value = numbers[i];
				}
				// Focus the next empty field or the last field
				const nextIndex = Math.min(numbers.length, digits.length - 1);
				digits[nextIndex].focus();
				updateHiddenInput(prefix);
			}
		});

		// Clear field on focus if it contains a value
		input.addEventListener('focus', () => {
			input.select();
		});
	});
}

/**
 * Update the hidden input with the combined 6-digit code
 */
function updateHiddenInput(prefix: string) {
	const hiddenInput = document.getElementById(`${prefix ? prefix.slice(0, -1) : '2fa'}CodeInput`) as HTMLInputElement;
	if (!hiddenInput) return;

	let code = '';
	for (let i = 1; i <= 6; i++) {
		const digit = document.getElementById(`${prefix}digit${i}`) as HTMLInputElement;
		if (digit) {
			code += digit.value || '';
		}
	}
	hiddenInput.value = code;
}

/**
 * Initialize 2FA inputs after page render
 */
export function init2FAPage() {
	// Set up regular 2FA page inputs
	setup2FAInputs();
	
	// Focus first input
	const firstDigit = document.getElementById('digit1') as HTMLInputElement;
	if (firstDigit) {
		firstDigit.focus();
	}
}

/**
 * Initialize login 2FA inputs after page render
 */
export function initLogin2FAPage() {
	// Set up login 2FA page inputs
	setup2FAInputs('login');
	
	// Focus first input
	const firstDigit = document.getElementById('loginDigit1') as HTMLInputElement;
	if (firstDigit) {
		firstDigit.focus();
	}
}