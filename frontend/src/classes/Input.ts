export class InputField {
	private name: string;
	private type: string;
	private placeholder: string;
	private autocomplete: string;
	private required: boolean;
	private translate: string;
	private labelClass?: string;
	private value?: string;

	constructor(name: string, type: string, placeholder: string, autocomplete: string, required: boolean, translate: string) {

		this.name = name;
		this.type = type;
		this.placeholder = placeholder;
		this.autocomplete = autocomplete;
		this.required = required;
		this.translate = translate;
	}
	
	public toHtml() {
	return `
	<label for="${this.name}" 
		class="${this.labelClass ?? 'sr-only'}"
		translate="${this.translate}"
	>
		${this.placeholder}
	</label>
	
	<input
		id="${this.name}"
		name="${this.name}"
		type="${this.type}"
		autocomplete="${this.autocomplete}" 
		class="font-title p-2 border rounded w-full text-tertiary dark:text-dtertiary border-primary dark:border-dprimary bg-zinc-200 dark:bg-transparent focus:ring-1  ring-primary dark:ring-dprimary focus:outline-none"
		translate="${this.translate}"
		
		placeholder="${this.placeholder}" ${this.required ? 'required' : ''} 
		value="${this.value ?? ''}"
	/>`
}}