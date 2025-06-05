/**
 * Gestion des differentes options sur le dashboard
 * avant de lancer une partie
 * @param inputValue - DOMStringMap contenant l'element selectionne (local-PVP, local-PVE, online)
 */
export function toggleGameSettings(inputValue: DOMStringMap) {
	
	console.log("toggleGameSettings", inputValue);
	const type = inputValue.gametype;
	if (!type) {
		return;
	}
	
	const localPVPSettings = document.getElementById('local-PVP-settings');
	const onlineSettings = document.getElementById('online-settings');
	
	switch (type) {
		
		case 'localpvp':
			hideContainer(onlineSettings as HTMLDivElement);
			localPVPSettings?.classList.remove('hidden');
			
			setTimeout(() => {
				onlineSettings?.classList.add('hidden');
				localPVPSettings?.classList.remove('opacity-0');
				localPVPSettings?.classList.add('opacity-100');
			}, 200);
			break;

		case 'localpve':
			hideContainer(onlineSettings as HTMLDivElement);
			hideContainer(localPVPSettings as HTMLDivElement);
			break;
		
		case 'tournament':
			hideContainer(onlineSettings as HTMLDivElement);
			hideContainer(localPVPSettings as HTMLDivElement);
			break;

		case 'online':
			hideContainer(localPVPSettings as HTMLDivElement);
			onlineSettings?.classList.remove('hidden');
			
			setTimeout(() => {
				onlineSettings?.classList.remove('opacity-0');
				onlineSettings?.classList.add('opacity-100');
			}, 200);
			break;
	}
}

function hideContainer(container: HTMLDivElement) {
	container?.classList.remove('opacity-100');
	container?.classList.add('opacity-0');
	container?.classList.add('hidden');
}