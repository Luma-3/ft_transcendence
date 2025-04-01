export function LoginButton() {
	return `
		<div class="flex items-center justify-center">
			<button id="loadLogin" class="flex w-1/4 bg-primary rounded-full items-center justify-center hover:cursor-pointer hover:ring-2 ring-secondary">
				<img src='images/duck.png' class="invert flex w-1/4 py-2 pointer-events-none" alt='Transcenduck Logo' />
			</button>
		</div>
	`;
}