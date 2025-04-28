export default function notFoundPage() {
	return `
	<div class="flex flex-col font-title justify-center items-center h-screen text-center bg-primary dark:bg-dprimary text-secondary dark:text-dtertiary">
	<div class="flex w-3/4 max-w-[400px] justify-center items-center animate-fade-in-down">
		<img src="/images/404Logo.png" class="w-full h-full" alt="404 Logo" class="w-1/5 h-1/4 animate-fade-in-down"/>
	</div>
	404 - Page not found
	</div>`;
}