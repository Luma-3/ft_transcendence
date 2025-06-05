/**
 * Je vais pas dire ce qu'est un footer, demerde toi pour trouver
 */

export function footer() {
	return `
	<div class="flex left-0 w-full h-50 md:h-40 lg:h-30 mt-10
	bg-primary dark:bg-dprimary text-tertiary dark:text-dtertiary
	items-center justify-between rounded-sm">
	
	<div class="flex max-w-[1000px] w-full mx-auto justify-between items-center">
		<div class="text-responsive-size justify-start ml-2 font-title">
			<div class="p-2">Transcenduck <br> </div>
			<div class="text-xs space-y-2 p-2">
				<span translate="version">Version</span> 0.0.0 <br> 
				<span translate="no-duck-hurt">No duck was hurt</span>
				<span translate="during-development">during development</span>
			</div>
		</div>
		<div class="flex justify-middle items-center font-title hover:cursor-pointer">
			<div class="text-xs p-2">
				<a class="text-responsive-size underline" href="https://github.com/Luma-3"> Github</a> <br>
				<a class="hover:underline" href="https://github.com/Luma-3"> Jean-Baptiste BROUSSE</a> <br>
				<a class="hover:underline" href="https://github.com/SenseiTarzan"> Gabriel CAPTARI </a> <br>
				<a class="hover:underline" href="https://github.com/LeSabreDeDieu"> Sayf-Allah GABSI </a> <br>
				<a class="hover:underline" href="https://github.com/monsieurCanard"> Anthony GABRIEL </a> <br>
		</div>
		</div>
		<div class="flex justify-end items-center font-title hover:cursor-pointer">
			<div class="text-xs p-2 mr-4">
				<a class="hover:underline" translate="rgpd"> RGPD</a> <br>
				<a class="hover:underline" translate="terms-of-service">Terms of service</a> <br>
				<a class="hover:underline" translate="cookies-policy">Cookies policy</a> <br>
				<a href="https://localhost:5173/documentation" class="hover:underline" translate="api-doc">Api Doc</a> <br>
				<a class="hover:underline" translate="contact">Contact</a> <br>
			</div>
		</div>
	</div>
	</div>`
}