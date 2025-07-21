/**
 * Gestion des differentes options sur le dashboard
 * avant de lancer une partie
 * @param inputValue - DOMStringMap contenant l'element selectionne (local-PVP, local-PVE, online)
 */
export function toggleGameSettings(inputValue: DOMStringMap) {
	
	const type = inputValue.gametype;
	if (!type) {
		return;
	}
	
	const localPVPSettings = document.getElementById('local-PVP-settings');
	const onlineSettings = document.getElementById('online-settings');
	switch (type) {
		
		case 'local':
			hideContainer(onlineSettings as HTMLDivElement);
			localPVPSettings?.classList.remove('hidden');
			
			setTimeout(() => {
				onlineSettings?.classList.add('hidden');
				localPVPSettings?.classList.replace('opacity-0', 'opacity-100');
			}, 200);
			break;

		case 'ai':
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
				onlineSettings?.classList.replace('opacity-0', 'opacity-100');
			}, 200);
			break;
	}
}

function hideContainer(container: HTMLDivElement) {
	container?.classList.replace('opacity-100', 'opacity-0');
	container?.classList.add('hidden');
}