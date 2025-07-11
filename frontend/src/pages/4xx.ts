import { backSafePlace } from "../components/ui/buttons/backSafePlace";

export default function notFoundPage() {
return `
<div class="flex flex-col font-title h-full mt-40 mb-40 justify-center items-center text-center text-secondary dark:text-dtertiary">

		<div class="flex w-3/4 max-w-[400px] justify-center items-center animate-fade-in-down mb-4">

			<img src="/images/404-speed.gif" class="w-full h-full rounded-full " alt="404 Logo" class="w-1/5 h-1/4 animate-fade-in-down"/>

		</div>

		<div class="flex text-2xl text-secondary dark:text-dtertiary font-bold animate-fade-in-down animate-bounce">

			404

		</div>

		<div class="text-2xl font-bold animate-fade-in-down" translate="not-found">

		Page Not Found

		</div>

		${backSafePlace()}

</div>`;
}