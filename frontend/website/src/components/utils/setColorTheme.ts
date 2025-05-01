export function setupColorTheme() {
	localStorage.getItem('theme') === 'light' ? document.documentElement.classList.remove('dark') : '';
}