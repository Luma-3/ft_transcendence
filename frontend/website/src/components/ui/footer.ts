export function footer() {
	return `
	<div class="bottom-0 left-0 w-full h-40 mt-10
	bg-primary dark:bg-dprimary text-tertiary dark:text-dtertiary
	flex items-center justify-between rounded-sm">
		<div class="text-xl justify-start ml-2 font-title">
			<div class="p-2">Transcenduck <br> </div>
			<div class="text-xs space-y-2 p-2">
				<span translate="version">Version</span> 0.0.0 <br> 
				<span translate="no-duck-hurt">No duck was hurt</span>
				<span translate="during-development">during development</span>
			</div>
		</div>
		<div class="text-xs justify-middle font-title hover:cursor-pointer">
			<div class="text-xs space-y-4 p-2">
				<a class="hover:underline text-xl" translate="rgpd"> RGPD</a> <br>
				<a class="hover:underline" translate="terms-of-service">Terms of service</a> <br>
				<a class="hover:underline" translate="cookies-policy">Cookies policy</a> <br>
				<a class="hover:underline" translate="contact">Contact</a> <br>
			</div>
		</div>
		<div class="text-xs justify-middle font-title mr-2 hover:cursor-pointer">
			<div class="text-xs space-y-4 p-2">
				<a class="text-xl hover:underline" href="https://github.com/Luma-3"> Github</a> <br>
				<a class="hover:underline" href="https://github.com/Luma-3"> Jean-Baptiste BROUSSE</a> <br>
				<a class="hover:underline" href="https://github.com/LeSabreDeDieu"> Sayf-allah GABSI </a> <br>
				<a class="hover:underline" href="https://github.com/monsieurCanard"> Anthony GABRIEL </a> <br>
		</div>
		</div>`
}