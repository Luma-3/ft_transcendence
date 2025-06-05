export interface Player {
	playerId: string; // Unique identifier for the player
	gameName: string; // Name of the player in the game
	clientId: string; // Client identifier
	joined: boolean; // Indicates if the player is ready to start the game
	ready: boolean; // Indicates if the player is ready to start the game
	score: number; // Player's score in the game
}
