import { primaryButton } from './primaryButton';

export function change2FA() {
	return `<div class="grid sm:grid-cols-2 gap-4 items-center">
	<div class="text-xl md:text-2xl font-title justify-center animate-pulse" translate="2fa-auth">
	2FA Authentication
	</div>
	${primaryButton({id: 'enable2fa', weight: "1/4", text: 'Activate 2FA', translate: 'activate-2fa', type: 'button'})}
	</div>
	<div class="flex flex-col p-2 max-w-[800px] justify-center items-center w-full text-md font-title" translate="2fa-warning">
		Warning ! <br>
		No 2FA reduces security
		(as anyone can access your account)<br> and increases the
		risk of accidental actions.<br> This is not recommended !
	</div>`
}