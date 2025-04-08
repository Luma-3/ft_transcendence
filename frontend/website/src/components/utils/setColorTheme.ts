export function setupColorTheme() {
if (localStorage.getItem('theme') === 'light') {
		document.documentElement.classList.remove('dark');
	} else {
		document.documentElement.classList.add('dark');
	}
}