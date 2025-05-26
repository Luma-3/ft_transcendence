import { renderGame } from "../components/renderPage";

export function handleGameSocketMessage(data: any) {
	switch(data.gameData.action) {
		case 'game-started':
			renderGame(data.gameData);
			break;
		case 'game-updated':
			
	}
}