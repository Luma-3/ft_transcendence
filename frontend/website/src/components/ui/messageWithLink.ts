export function messageWithLink(message: string, linkMessage: string, idLink: string) {
	return `
	<div class="flex flex-row items-center justify-center">
		<div class="font-title" translate="${message}">
			${message}
			Don't have an account?
		</div>
		<div id="${idLink}" class="font-title dark:text-dsecondary text-primary cursor-pointer p-2
		 hover:text-tertiary hover:dark:text-dtertiary"
		 translate="${linkMessage}">
		</div>
	</div>`;
}