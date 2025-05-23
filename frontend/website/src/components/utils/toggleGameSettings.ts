export function toggleGameSettings(inputValue: DOMStringMap) {
	console.log("COUCOUY")
	console.log(inputValue);
	const type = inputValue.gametype;
	if (!type) {
		return;
	}
	console.log(type);
	const localSettings = document.getElementById('local-settings');
	const onlineSettings = document.getElementById('online-settings');
	switch (type) {
		
		case 'local':
			onlineSettings?.classList.remove('opacity-100');
			onlineSettings?.classList.add('opacity-0');
			setTimeout(() => {
				onlineSettings?.classList.add('hidden');
				localSettings?.classList.remove('hidden');
				localSettings?.classList.remove('opacity-0');
				localSettings?.classList.add('opacity-100');
			}, 500);
			// setTimeout(() => {
			// }, 500);
			break;

		case 'online':
			localSettings?.classList.remove('opacity-100');
			localSettings?.classList.add('opacity-0');
			setTimeout(() => {
				localSettings?.classList.add('hidden');
				onlineSettings?.classList.remove('opacity-0');
				onlineSettings?.classList.add('opacity-100');
				onlineSettings?.classList.remove('hidden');
			}, 500);
	}
}
