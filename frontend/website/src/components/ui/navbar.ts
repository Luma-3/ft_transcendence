export function navbar(photoProfil: string) {
	return `
	<nav class="flex items-center w-full justify-between flex-wrap p-2">
		<div class="flex w-full justify-between items-center">
			<div class="flex justify-start items-center">
				<a href="/dashboard" class="mr-2 flex items-center font-title text-primary dark:text-dprimary">Transcenduck</a>
			</div>
			<div id="menu-dropdown" class="flex rounded-full hover:cursor-pointer">
				<img id="user-menu-button" class="w-8 h-8 rounded-full" src="/images/${photoProfil}" alt="User profile picture">
			</div>
		</div>
	</nav>`;
}