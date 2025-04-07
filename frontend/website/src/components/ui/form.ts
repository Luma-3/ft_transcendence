import { primaryButton } from './primaryButton.ts';

type InputField = {
	name: string;
	type: string;
	placeholder: string;
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
};

export function form({ name, inputs, button }: FormOptions): string {
	const inputFields = inputs
		.map(
			(input) => `
		<label for="${input.name}" class="sr-only" translate="${input.translate || ''}">${input.placeholder}</label>
		<input name="${input.name}" type="${input.type}" autocomplete="${input.autocomplete || ''}" 
			class="font-text p-2 border border-tertiary rounded w-full ring-primary focus:ring-1 focus:outline-none" 
			placeholder="${input.placeholder}" ${input.required ? 'required' : ''} />
	`
		)
		.join('');

	return `
	<form id="registerUser" name="${name}" class="flex flex-col items-center space-y-4 w-1/2">
		${inputFields}
		${primaryButton(button)}
	</form>
	`;
}