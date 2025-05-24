export function toggleGameSettings(inputValue: DOMStringMap) {
	const type = inputValue.gametype;
	if (!type) {
		return;
	}

	const localPVPSettings = document.getElementById('local-PVP-settings');
	const onlineSettings = document.getElementById('online-settings');
	
	switch (type) {
		
		case 'local-PVP':
			onlineSettings?.classList.remove('opacity-100');
			onlineSettings?.classList.add('opacity-0');
			setTimeout(() => {
			onlineSettings?.classList.add('hidden');
			localPVPSettings?.classList.remove('hidden');
			localPVPSettings?.classList.remove('opacity-0');
			localPVPSettings?.classList.add('opacity-100');
			}, 500);
			break;

		case 'local-PVE':
			onlineSettings?.classList.remove('opacity-100');
			onlineSettings?.classList.add('opacity-0');
			onlineSettings?.classList.add('hidden');

			localPVPSettings?.classList.remove('opacity-100');
			localPVPSettings?.classList.add('opacity-0');
			localPVPSettings?.classList.add('hidden');
			break;
		
		case 'online':
			localPVPSettings?.classList.remove('opacity-100');
			localPVPSettings?.classList.add('opacity-0');
			setTimeout(() => {
				localPVPSettings?.classList.add('hidden');
				
				onlineSettings?.classList.remove('hidden');
				onlineSettings?.classList.remove('opacity-0');
				onlineSettings?.classList.add('opacity-100');
			}, 500);
			break;
	}
}
