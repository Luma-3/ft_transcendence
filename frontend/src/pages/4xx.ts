export default function notFoundPage() {
return `
<div class="flex flex-col font-title h-full mt-40 mb-40 justify-center items-center text-center text-secondary dark:text-dtertiary">

		<div class="flex w-3/4 max-w-[400px] justify-center items-center animate-fade-in-down mb-4">

			<img src="/images/404-speed.gif" class="w-full h-full rounded-full " alt="404 Logo" class="w-1/5 h-1/4 animate-fade-in-down"/>

		</div>

		<div class="flex text-2xl text-secondary dark:text-dtertiary font-bold animate-fade-in-down animate-bounce">

			404

		</div>

		<div class="text-2xl font-bold animate-fade-in-down" translate="page-not-found">

		Page Not Found

		</div>

		<button onClick="window.location.href='/'" class="flex flex-row rounded-full items-center justify-center mt-4 py-2 px-4 text-tertiary dark:text-dtertiary bg-secondary dark:bg-dsecondary hover:bg-primary dark:hover:bg-dtertiary hover:text-primary dark:hover:text-dprimary shadow-lg transform transition-transform duration-300" translate="go-back-to-safe-place">

		Go back to safe place

		</button>

</div>`;
}