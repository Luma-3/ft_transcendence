
/**
 * @brief Hide or show elements based on the target element.
 * @details This function checks if the target element is inside a specific parent element.
 * If it is, it does nothing. If not, it toggles the visibility of the specified elements.
 * @param target 
 */
export function hideToggleElements(target: HTMLElement) {
	
	const elements = [
		'user-menu'
	]

	elements.forEach((element) => {
		const div = document.getElementById(element) as HTMLDivElement;

		if (div && !div.classList.contains('hidden')) {
			
			if (isInsideParentElement(target, div.id)) {
				return;
			}
			div.classList.toggle('hidden');
		}
	});
}

/**
 * @brief Verify if the element is inside the toggle parent element.
 * @details Usefull to avoid closing the toggle element when clicking inside it.
 * @return boolean
 * @param element(event target)
 * @param parentId ID of the toggle parent element
 */
function isInsideParentElement(element: HTMLElement, parentId: string): boolean {
	
	const parent = document.getElementById(parentId);
	
	if (!parent)
		return false;
	
	let currentElement: HTMLElement | null = element;
	
	while (currentElement) {
		if (currentElement === parent) {
			return true;
		}
		currentElement = currentElement.parentElement;
	}
	return false;
}