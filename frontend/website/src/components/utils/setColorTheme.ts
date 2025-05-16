/**
 * Wrapper pour changer le theme de l'application lors des renders de pages mais surtout lors
 * du rechargement du DOM car dark est present par default sur l'index.html
 */

export function setupColorTheme(theme: string | "dark") {
	theme === 'light' ? document.documentElement.classList.remove('dark') : '';
}