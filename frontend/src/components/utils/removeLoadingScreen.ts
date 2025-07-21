/**
 * Wrapper pour enlever l'overlay de chargement
 */
export function removeLoadingScreen() {
	const loading = document.querySelector<HTMLDivElement>('#loading')!;
	if (loading) {
		loading.classList.add('hidden');
	}
}
