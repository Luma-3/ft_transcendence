export function footer() {
	return `
	<div class="bottom-0 left-0 w-full h-40 mt-10
	bg-primary dark:bg-dprimary text-secondary dark:text-dtertiary
	flex items-center justify-between rounded-sm">
		<div class="text-xl justify-start ml-2 font-title">
			Transcenduck <br>
			<div class="text-xs w-1/2">
				<span translate="version">Version</span> 0.0.0 <br> 
				<span translate="no-duck-hurt">No duck was hurt</span>
				<span translate="during-development">during development</span>
			</div>
		</div>
		<div class="text-xs justify-middle mr-2 font-title hover:cursor-pointer">
			<a class="hover:underline" translate="rgpd"> Privacy policy / RGPD</a> <br>
			<a class="hover:underline" translate="terms-of-service">Terms of service</a> <br>
			<a class="hover:underline" translate="cookies-policy">Cookies policy</a> <br>
			<a class="hover:underline" translate="contact">Contact</a> <br>
		</div>
		<div class="text-xs justify-end mr-2 font-title">
			<span class="text-sm">GitHub</span> <br>
			<a class="hover:cursor-pointer hover:underline" href="https://github.com/Luma-3"> Jean-Baptiste BROUSSE</a> <br>
			<a class="hover:cursor-pointer hover:underline" href="https://github.com/LeSabreDeDieu"> Saif </a> <br>
			<a class="hover:cursor-pointer hover:underline" href="https://github.com/monsieurCanard"> Anthony GABRIEL </a> <br>
		</div>`
}