
export function changeLightMode() {
	const switchComponent = document.getElementById('switch-component') as HTMLInputElement;
	if (switchComponent) {
		document.documentElement.classList.toggle('dark');
		console.log("light mode");
		console.log(switchComponent.checked? 'dark' : 'light');
		localStorage.setItem('theme', switchComponent.checked ? 'dark' : 'light');
	}
}