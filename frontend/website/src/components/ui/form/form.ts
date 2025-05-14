import { primaryButton } from '../buttons/primaryButton.ts';
import { secondaryButton } from '../buttons/secondaryButton.ts';

type InputField = {
	name: string;
	type: string;
	labelClass?: string;
	placeholder?: string;
	value?: string;
	autocomplete?: string;
	required?: boolean;
	translate?: string;
};

type FormOptions = {
	name: string;
	inputs: InputField[];
	button: {
		id: string;
		weight?: string;
		text: string;
		translate?: string;
		type?: 'button' | 'submit';
	};
	button2?: {
		id: string;
		weight?: string;
		text: string;
		translate?: string;
		type?: 'button' | 'submit';
	};
};

export function form({ name, inputs, button, button2 }: FormOptions): string {
	const inputFields = inputs
		.map(
			(input) => `
		<label for="${input.name}" class="${input.labelClass || 'sr-only'}" translate="${input.translate || ''}">${input.placeholder}</label>
		<input id="${input.name}" name="${input.name}" type="${input.type}" autocomplete="${input.autocomplete || ''}" 
			class="font-title p-2 border rounded w-full
			text-tertiary dark:text-dtertiary
			border-primary dark:border-dprimary
			bg-zinc-200 dark:bg-transparent
			focus:ring-1  ring-primary dark:ring-dprimary focus:outline-none" translate="${input.translate || ''}"
			placeholder="${input.placeholder}" ${input.required ? 'required' : ''} 
			value="${input.value || ''}"
			/>`
		)
		.join('');

	return `
	<form id="${name}" name="${name}" class="flex flex-col justify-left text-responsive-size items-left space-y-4 w-3/4 sm:w-1/2 p-4 h-lg">
		${inputFields}
	<div class="flex flex-row gap-2 justify-between items-center">
		${primaryButton(button)}
		${button2 ? secondaryButton(button2) : ''}
	</div>
	</form>
	`;
}