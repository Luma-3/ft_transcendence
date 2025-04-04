function title() {
	return `
	<div class="text-6xl p-7 font-title animate-spin" translate="hack">HACKER ALERT</div>`
}

function text() {
	return `
	<div class="text-3xl p-7 font-text" translate="hack_text">FUCK YOU</div>`
}

export function hackPage() {
	return `
	<div class='flex flex-col items-center justify-center h-screen space-y-4 text-tertiary backdrop-filter backdrop-blur-xs'>
	${title()}
	${text()}
	</div>
	`;
}