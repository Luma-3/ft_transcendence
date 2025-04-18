export function registerLink() {
	return `
	<div class="flex flex-row items-center justify-center">
		<div class="font-title" translate="no_account">
			Don't have an account?
		</div>
		<div id="loadRegisterPage" class="font-title dark:text-dsecondary text-secondary cursor-pointer p-2
		 hover:text-tertiary hover:dark:text-dtertiary"
		 translate="register">
			Register
		</div>
	</div>`;
}