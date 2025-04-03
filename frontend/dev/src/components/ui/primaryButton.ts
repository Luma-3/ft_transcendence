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
	class="font-title p-2 bg-primary text-tertiary rounded w-${weight} hover:cursor-pointer hover:ring-1 ring-secondary" translate="${translate}">
	${text}</button>
	`;
}