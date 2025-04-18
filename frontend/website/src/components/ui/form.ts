import { primaryButton } from './primaryButton.ts';

type InputField = {
	name: string;
	type: string;
	labelClass?: string;
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
		<label for="${input.name}" class="${input.labelClass || 'sr-only'}" translate="${input.translate || ''}">${input.placeholder}</label>
		<input id="${input.name}" name="${input.name}" type="${input.type}" autocomplete="${input.autocomplete || ''}" 
			class="font-text p-2 border rounded w-full
			border-primary dark:border-dprimary
			focus:ring-1  ring-primary dark:ring-dprimary focus:outline-none" 
			placeholder="${input.placeholder}" ${input.required ? 'required' : ''} />
	`
		)
		.join('');

	return `
	<form id="registerUser" name="${name}" class="flex flex-col justify-left items-left space-y-4 w-full lg:w-1/2 p-4">
		${inputFields}
		${primaryButton(button)}
	</form>
	`;
}
