export function backdoor() {
	return `<div class="flex flex-row items-center justify-center">
			<a href="/dashboard" class="p-3 font-title text-center text-secondary
			hover:cursor-pointer hover:ring-2 ring-secondary"
			translate="login_guest">
				Back Door (uniquement pour les duckDev)
			</a>
		</div>`
}