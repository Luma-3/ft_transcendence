import { InputField } from "./Input";
import { Button } from "./Button";

export class Form {
	private name: string = '';
	private inputs: InputField[];
	private buttons: Button[];
	
	constructor(name: string, inputs: InputField[], buttons: Button[]) {
		this.name = name;
		this.inputs = inputs;
		this.buttons = buttons;
	}

	public toHtml() {
		return formToHtml(this.name, this.inputs, this.buttons);
	}


	public getValues(id: string) {
		const form = document.forms.namedItem(id) as HTMLFormElement;
		if (!form) { return; }

		const formData = new FormData(form);
		const formEntry = Object.fromEntries(formData) as Record<string, string>;
		return formEntry;
	}
}

function formToHtml(name: string, inputs: InputField[], buttons: Button[]) {

	const inputFields = inputs.map((input) => input.toHtml()).join('');
	
	let buttonsDiv = '';
	
	buttons.forEach(button => {
	buttonsDiv += (button.getLevel() === 'primary') ? button.primaryButton() : button.secondaryButton();
	});

	return `
	<form id="${name}" name="${name}" class="flex flex-col justify-center text-responsive-size items-center space-y-4 w-3/4 sm:w-1/2 p-4 h-lg">
		${inputFields}
	<div class="flex flex-row w-full gap-2 justify-between items-center">
		${buttonsDiv}
	</div>
	</form>
	`;
}