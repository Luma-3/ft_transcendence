export function setupColorTheme(theme: string | "dark") {
	theme === 'light' ? document.documentElement.classList.remove('dark') : '';
}