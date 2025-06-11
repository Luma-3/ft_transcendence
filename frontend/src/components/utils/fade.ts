/**
 * Wrapper pour l'apparition d'une div (qui a une transform animation)
 * @param HTMLDivElement
 */
export function fadeIn() {
	const main_container = document.querySelector<HTMLDivElement>('#app')!;
	const footer = document.querySelector('footer')!;
	footer.classList.remove('hidden')
	main_container.classList.remove('opacity-0', 'scale-95')
	main_container.classList.add('opacity-100', 'scale-100')
}

/**
 * Wrapper pour la disparition d'une div (qui a une transform animation)
 * @param HTMLDivElement
 */
export function fadeOut() {
	const main_container = document.querySelector<HTMLDivElement>('#app')!;
	const footer = document.querySelector('footer')!;
	footer.classList.add('hidden')
	main_container.classList.remove('opacity-100', 'scale-100')
	main_container.classList.add('opacity-0', 'scale-95')
}