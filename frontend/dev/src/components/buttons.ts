export function renderButton({
	id,
	weight = 'full',
	text,
	color,
	textColor = 'white',
	translate,
	type = 'button',
}: {
	id: string;
	weight?: string;
	text: string;
	color: string;
	// color: 'primary' | 'secondary' | 'grey';
	textColor?: string;
	translate?: string;
	type?: 'button' | 'submit';
}) {
	return `
	<button id="${id}" type="${type}" 
	class="font-title p-2 bg-${color} text-${textColor} rounded w-${weight} hover:cursor-pointer hover:ring-1 ring-secondary" translate="${translate}">
	${text}</button>
	`;
}