import { ConflictError, NotFoundError } from "@transcenduck/error";

import { Player } from "../core/runtime/Player.js";
import { Tournament } from "./Tournament.js";

export class TournamentManager {
  private static instance: TournamentManager = undefined;

  private tournaments: Map<string, Tournament> = new Map();
  private playersInTournament: Map<string, Tournament> = new Map();

  public static getInstance(): TournamentManager {
    if (!this.instance) {
      this.instance = new TournamentManager();
    }
    console.log(`instance => `, this.instance);
    return this.instance;
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

      console.log(`Player ${player.id} joining tournament ${id} By set`);
      tournament.addPlayer(player);
      this.playersInTournament.set(player.id, tournament);
      return tournament.id;
    }
    
    let tournamentId = undefined;
    this.tournaments.forEach((tournament) => {
      console.log(`tournament => `, tournament);
      if (tournament.isJoinable()) {
        console.log(`Player ${player.id} joining tournament ${tournament.id} By Found`);
        tournament.addPlayer(player);
        this.playersInTournament.set(player.id, tournament);
        tournamentId = tournament.id;
        return;
      }
    })
    return tournamentId; 
  }

  public deleteTournament(id: string) {
    const tournament = this.tournaments.get(id);
    if (tournament) {
      this.playersInTournament.forEach((tournament, playerId) => {
        if (tournament.id === id) {
          this.playersInTournament.delete(playerId);
        }
      })
      tournament.stop();
      this.tournaments.delete(id);
    }
  }
}
