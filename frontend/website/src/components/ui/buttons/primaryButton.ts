export function primaryButton({
	id,
	weight = 'full',
	text,
	translate,
	type = 'button',
}: {
	id: string;
	weight?: string;
	text: string;
	translate?: string;
	type?: 'button' | 'submit';
}) {
	return `
	<button id="${id}" type="${type}" 
	class="font-title text-responsive-size p-2 rounded w-${weight} 
	bg-primary text-tertiary dark:bg-dprimary dark:text-dtertiary
	hover:cursor-pointer hover:ring-1 ring-tertiary dark:ring-dsecondary"
	translate="${translate}">
	${text}
	</button>
	`;
}