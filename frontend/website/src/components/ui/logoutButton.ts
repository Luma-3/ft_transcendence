import { primaryButton } from './primaryButton'

export function logoutButton() {
	return `<div class="text-2xl font-title dark:text-dtertiary justify-center">
	${primaryButton({id: 'logout', weight: "full", text: 'Log out', translate: 'logout', type: 'button'})}
	</div>`
}