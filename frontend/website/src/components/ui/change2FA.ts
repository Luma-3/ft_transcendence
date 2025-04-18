import { primaryButton } from './primaryButton';

export function change2FA() {
	return `<div class="text-2xl font-title justify-center animate-pulse" translate="2fa-auth">
	2FA Authentication<br></div>
	${primaryButton({id: 'enable2fa', weight: "1/4", text: 'Disable', translate: 'disable', type: 'button'})}
	<div class="text-md font-title" translate="2fa-warning">
		Warning ! <br>
		No 2FA reduces security
		(as anyone can access your account)<br> and increases the
		risk of accidental actions.<br> This is not recommended !
	</div>`
}