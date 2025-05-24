

/**
 * Wrapper pour l'apparition d'une div (qui a une transform animation)
 * @param HTMLDivElement
 */
export function fadeIn(HTMLDivElement: HTMLDivElement) {
	HTMLDivElement.classList.remove('opacity-0', 'scale-95')
	HTMLDivElement.classList.add('opacity-100', 'scale-100')
}

/**
 * Wrapper pour la disparition d'une div (qui a une transform animation)
 * @param HTMLDivElement
 */
export function fadeOut(HTMLDivElement: HTMLDivElement) {
	HTMLDivElement.classList.remove('opacity-100', 'scale-100')
	HTMLDivElement.classList.add('opacity-0', 'scale-95')
}