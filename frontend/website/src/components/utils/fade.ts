export function fadeIn(HTMLDivElement: HTMLDivElement) {
	HTMLDivElement.classList.remove('opacity-0')
	HTMLDivElement.classList.add('opacity-100')
}

export function fadeOut(HTMLDivElement: HTMLDivElement) {
	HTMLDivElement.classList.remove('opacity-100')
	HTMLDivElement.classList.add('opacity-0')
}