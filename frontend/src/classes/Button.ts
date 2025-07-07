
export class Button {
	private id: string;
	private weight?: string;
	private text: string;
	private translate: string;
	private level: 'primary' | 'secondary';
	private type?: 'button' | 'submit';


	constructor(id: string, weight: string | "full", text: string, translate: string, level: 'primary' | 'secondary', type: 'button' | 'submit') {

		this.id = id;
		this.weight = weight;
		this.text = text;
		this.translate = translate;
		this.level = level;
		this.type = type;
	}

	public getLevel() {
		return this.level;
	}
	
	public primaryButton() {
	return `
	<button id="${this.id}" type="${this.type}" 
	class="font-title text-responsive-size p-2 rounded w-${this.weight} 
bg-primary text-tertiary dark:bg-dprimary dark:text-dtertiary
	hover:cursor-pointer hover:ring-1 ring-tertiary dark:ring-dsecondary"
	translate="${this.translate}">
	${this.text}

	</button>
	`
}

	public secondaryButton() {
	return `
	<button id="${this.id}" type="${this.type}" 
	class="font-title text-responsive-size md:text-md p-2 
	bg-tertiary text-primary dark:text-dtertiary
	rounded w-${this.weight} hover:cursor-pointer hover:ring-1 ring-secondary" 
	translate="${this.translate}">
	
	${this.text}
	
	</button>
	`;
	}
}