export function toggleUserMenu() {
	console.log('openUserMenu');
	const userMenu = document.getElementById('user-menu') as HTMLDivElement;
	if (userMenu) {
		userMenu.classList.toggle('hidden');
	}
}