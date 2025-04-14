
export function navbar(userinfo: { username: string | undefined }) {
	return `
	<nav class="flex items-center w-full justify-between flex-wrap p-2">
		<div class="flex w-full justify-between items-center">
			<div class="flex justify-start items-center">
				<a href="/dashboard" class="mr-2 flex items-center font-title text-primary dark:text-dprimary">Transcenduck</a>
			</div>
			<div id="user-menu-button" class="flex justify-end items-center cursor-pointer">
				<span class="pointer-events-none mr-2 flex items-center font-title text-primary dark:text-dprimary overflow-hidden truncate">
				${userinfo.username}
				</span>
				<img class="w-8 h-8 rounded-full pointer-events-none" src="/images/pp.jpg" alt="User profile picture">
			</div>
		</div>
	</nav>`;
}