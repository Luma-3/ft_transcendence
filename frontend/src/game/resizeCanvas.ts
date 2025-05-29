export function resizeCanvas() {
	const canvas = document.getElementById('gamePong') as HTMLCanvasElement;
	const gameRatio = 16 / 9; // Ratio de l'aspect du jeu
	const windowRatio = window.innerWidth / window.innerHeight;
	const containerHeight = window.innerHeight - 200; // Ajuster la hauteur du conteneur
	const containerWidth = window.innerWidth - 200; // Ajuster la largeur du conteneur

	let newWidth: number;
	let newHeight: number;
	 
	if (windowRatio > gameRatio) {
	// Fenêtre plus large → on ajuste à la hauteur
	newHeight = containerHeight;
	newWidth = newHeight * gameRatio;
  } else {
	// Fenêtre plus haute → on ajuste à la largeur
	newWidth = containerWidth;
	newHeight = newWidth / gameRatio;
  }
	canvas.style.width = (newWidth > 800) ? `800px` : `${newWidth}px`;
	canvas.style.height = (newHeight > 600) ? `600px` : `${newHeight}px`;
}
