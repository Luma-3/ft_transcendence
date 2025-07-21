import { backSafePlace } from "../components/ui/buttons/backSafePlace";

function messageErrorFromTheServer(messageServer?: string) {
	if (!messageServer) {
		return;
	}
	return `
		<div class="flex font-title text-xl p-4 bg-zinc-200 rounded=lg">

		Message from the server: ${messageServer}

		</div>`
}

export default function errorPage(code?: string, message?: string, messageServer?: string) {

	const error_code = code || '500';
	const message_error = message || 'internal-server-error';

	return `
<div class="flex flex-col font-title justify-center items-center mt-20 mb-20 text-center  text-secondary dark:text-dtertiary">

	<div class="flex w-3/4 max-w-[400px] justify-center items-center animate-fade-in-down mb-4">

		<img src="/images/500-speed.gif" class="w-full h-full rounded-full " alt="404 Logo" class="w-1/5 h-1/4 animate-fade-in-down"/>

	</div>
	
	<div class="flex text-2xl text-secondary dark:text-dtertiary font-bold animate-fade-in-down animate-bounce">
		
	${error_code}
	
	</div>

	${messageErrorFromTheServer(messageServer) || ''}

	<div class="flex font-title text-xl p-4 rounded=lg">

	${message_error}

	</div>
	
	${backSafePlace()}

</div>`;
}