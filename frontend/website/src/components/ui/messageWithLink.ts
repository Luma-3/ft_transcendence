export function messageWithLink(message: string, linkMessage: string, idLink: string) {
	return `
	<div class="flex flex-row text-responsive-size items-center justify-center dark:text-dtertiary">
		<div class="font-title text-secondary dark:text-dtertiary" translate="${message}">
			${message}
			Don't have an account?
		</div>
		<div id="${idLink}" class="font-title p-2 dark:text-dsecondary  text-primary cursor-pointer
		 hover:text-tertiary hover:dark:text-dtertiary"
		 translate="${linkMessage}">
		</div>
	</div>`;
}