export function toggleUserMenu() {
	console.log('openUserMenu');
	const userMenu = document.getElementById('user-menu') as HTMLDivElement;
	if (userMenu) {
		userMenu.classList.toggle('hidden');
		void userMenu.offsetWidth;

		if (userMenu.classList.contains('opacity-0')) {
		userMenu.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
		userMenu.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
		}
		else {
		userMenu.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
		userMenu.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
		}
	}	
}