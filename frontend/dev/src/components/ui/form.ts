import { renderPrimaryButton } from './primary-button.ts';

type InputField = {
	id: string;
	type: string;
	placeholder: string;
	autocomplete?: string;
	required?: boolean;
	translate?: string;
};

type FormOptions = {
	id: string;
	inputs: InputField[];
	button: {
		id: string;
		weight?: string;
		text: string;
		translate?: string;
		type?: 'button' | 'submit';
	};
};

export function renderForm({ id, inputs, button }: FormOptions): string {
	const inputFields = inputs
		.map(
			(input) => `
		<label for="${input.id}" class="sr-only" translate="${input.translate || ''}">${input.placeholder}</label>
		<input id="${input.id}" type="${input.type}" autocomplete="${input.autocomplete || ''}" 
			class="font-text p-2 border border-tertiary rounded w-full ring-primary focus:ring-1 focus:outline-none" 
			placeholder="${input.placeholder}" ${input.required ? 'required' : ''} />
	`
		)
		.join('');

	return `
	<form id="${id}" class="flex flex-col items-center space-y-4 w-1/2">
		${inputFields}
		${renderPrimaryButton(button)}
	</form>
	`;
}