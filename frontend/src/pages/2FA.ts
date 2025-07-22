import { render2FaPages, renderPrivatePage } from '../controllers/renderPage';

import { headerPage } from '../components/ui/headerPage';
import { FetchInterface } from '../api/FetchInterface';
import { Button } from '../classes/Button';
import { alert } from '../components/ui/alert/alert';

let _action = 'enable';

export function loginTwoFaPage() {
	return render2FaPages('login');
}


export async function enable2FA() {
	if (await FetchInterface.activate2FA()) {
		render2FaPages('enable');
	}
}

export async function disable2FA() {
	if (await FetchInterface.desactivate2FA()) {
		render2FaPages('disable');
	}
}

export function get2FACode() {
	const codeInput = document.getElementById('2faCodeInput') as HTMLInputElement;
	if (!codeInput) {
		return '';
	}

	let code = '';
	for (let i = 1; i <= 6; i++) {
		const digit = document.getElementById(`digit${i}`) as HTMLInputElement;
		if (digit) {
			code += digit.value || '';
		}
	}
	codeInput.value = code;
	return codeInput.value.trim();
}

export async function submit2FACode() {

	const code = get2FACode();
	if (!code) {
		return await alert("error", "enter-valid-2fa-code");
	}
	const methods: { [key: string]: 'GET' | 'DELETE' | 'PUT' } = {
		'enable': 'PUT',
		'login': 'GET',
		'disable': 'DELETE'
	};

	const success = await FetchInterface.submit2FACode(code, methods[_action]);
	if (success) {
		renderPrivatePage('dashboard');
	}
}

/**
 * ! Contenu html de la page 2FA
 */
export default async function twoFaPage(target: string = 'login') {

	_action = target;
	const formButton = new Button('submit2faCode', "1/4", 'Submit 2FA Code', 'validate-2fa-code', 'primary', 'submit')

	return `<div class="flex flex-col w-full h-full rounded-lg justify-center mt-4">

	${headerPage("2fa-auth", (target === 'login') ? 'public' : 'private', "settings")}

	<div class="flex flex-col w-full h-full rounded-lg justify-center items-center mt-5 mb-4">

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
		// Empêche la saisie de caractères non numériques
		input.addEventListener('keypress', (e) => {
			if (!/\d/.test(e.key)) {
				e.preventDefault();
			}
		});

		// Auto-focus to next field sur input
		input.addEventListener('input', (e) => {
			const target = e.target as HTMLInputElement;
			let value = target.value.replace(/\D/g, '');
			if (value.length > 1) value = value[0];
			target.value = value;

			updateHiddenInput(prefix);

			if (value && index < digits.length - 1) {
				digits[index + 1].focus();
			}
		});

		// Coller : remplir tous les champs d'un coup, focus le dernier
		input.addEventListener('paste', (e) => {
			const pastedData = e.clipboardData?.getData('text') || '';
			const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
			if (numbers.length === 6) {
				e.preventDefault();
				for (let i = 0; i < digits.length; i++) {
					digits[i].value = numbers[i] || '';
				}
				updateHiddenInput(prefix);
				digits[5].focus();
				digits[5].select();
			}
		});

		// Focus : sélectionne le contenu pour écraser facilement
		input.addEventListener('focus', () => {
			setTimeout(() => input.select(), 0);
		});
	});
}

/**
 * Update the hidden input with the combined 6-digit code
 */
function updateHiddenInput(prefix: string) {
	let hiddenId = '2faCodeForm';
	const hiddenInput = document.getElementById(hiddenId) as HTMLInputElement;
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
	setup2FAInputs();

	const firstDigit = document.getElementById('digit1') as HTMLInputElement;
	if (firstDigit) {
		firstDigit.focus();
	}
}