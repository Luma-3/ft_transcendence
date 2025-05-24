import { primaryButton } from './primaryButton'

export function deleteAccountButton() {
	return `<div class="text-2xl font-title text-red-600 justify-center border-2 border-red-600 rounded-lg p-2">
	<div class="mb-3 text-color-red-500 animate-pulse" translate="dangerous-action">Dangerous action !</div>
	${primaryButton({id: 'deleteAccount', weight: "1/3", text: 'Delete account', translate: 'delete-account', type: 'button'})}
	</div>`
}