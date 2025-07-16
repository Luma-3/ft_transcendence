import { ConflictError, NotFoundError } from "@transcenduck/error";

import { Player } from "../core/runtime/Player.js";
import { Tournament } from "./Tournament.js";

export class TournamentManager {
	private static instance: TournamentManager;

	private tournaments: Map<string, Tournament> = new Map();
	private playersInTournament: Map<string, Tournament> = new Map();

	public static getInstance(): TournamentManager {
		if (!TournamentManager.instance) {
			TournamentManager.instance = new TournamentManager();
		}
		return TournamentManager.instance;
	}

	public createTournament() {
		const tournament = new Tournament();
		this.tournaments.set(tournament.id, tournament);
		return tournament.id;
	}

	public joinTournament(player: Player, id?: string) {
		if (this.playersInTournament.has(player.id)) {
			throw new ConflictError(`Player ${player.id} is already in a tournament`);
		}

		if (id) {
			const tournament = this.tournaments.get(id);
			if (!tournament) throw new NotFoundError('tournament');

			console.log(`Player ${player.id} joining tournament ${id}`);
			tournament.addPlayer(player);
			this.playersInTournament.set(player.id, tournament);
			return tournament.id;
		}

		this.tournaments.forEach(tournament => {
			if (tournament.isJoinable()) {
				tournament.addPlayer(player);
				this.playersInTournament.set(player.id, tournament);
				return tournament.id;
			}
		})
		return undefined;
	}

	public deleteTournament(id: string) {
		const tournament = this.tournaments.get(id);
		if (tournament) {
			tournament.stop();
			this.tournaments.delete(id);
		}
	}
}