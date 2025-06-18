import { v4 as uuidv4 } from 'uuid';
import { Pong } from './Pong.js';
import { PlayerType } from '../room/player.schema.js';
import { GameType, RoomInfoType } from '../room/room.schema.js';
import { NotFoundError, InternalServerError } from '@transcenduck/error';

type StatusType = 'waiting' | 'roomReady' | 'readyToStart' | 'playing' | 'finished';

/**
 * Représente une salle de jeu pour différentes variantes de Pong.
 * 
 * Gère l'ajout et la suppression de joueurs, le statut de la salle,
 * la création et la gestion d'une partie de Pong, ainsi que diverses
 * informations sur la salle et ses participants.
 * 
 * @remarks
 * - Supporte plusieurs types de jeux (local, en ligne, tournoi).
 * - Permet de suivre l'état de la salle (attente, prête, en cours, terminée).
 * - Fournit des méthodes utilitaires pour accéder aux joueurs et aux données de la salle.
 */
export class Room {
  id: string;
  name: string;
  typeGame: GameType;
  status: StatusType = 'waiting';
  players: [PlayerType, PlayerType] = [undefined, undefined];
  pong: Pong | null;
  isFull: boolean;
  createdAt: Date;
  maxPlayers: number;
  playerReady: number;
  private: boolean = false;

  constructor(typeGame: GameType) {
    this.id = uuidv4();
    this.name = '';
    this.typeGame = typeGame;
    if (typeGame === 'localpvp' || typeGame === 'localpve') {
      this.status = 'readyToStart';
    }
    this.pong = null; // Instance of Pong game
    this.isFull = false;
    this.createdAt = new Date();
    this.maxPlayers = typeGame === 'online' ? 2 : 1;
    this.playerReady = 0;
  }

  countPlayer(): number {
    let nbPlayers = 0;
    for (const player of this.players) {
      if (player !== undefined) {
        nbPlayers++;
      }
    }
    return nbPlayers;
  }

  /**
   * Ajoute un joueur à la salle si une place est disponible.
   *
   * @param player - L'objet joueur à ajouter à la salle.
   * @returns `true` si le joueur a été ajouté avec succès ; `false` si la salle est déjà pleine.
   *
   * @remarques
   * - Si la salle atteint sa capacité maximale après l'ajout du joueur, la propriété `isFull` passe à `true` et le statut de la salle devient `'roomReady'`.
   * - Si la salle n'a pas de nom, il sera défini comme `Room-<player.gameName>`.
   */
  addPlayer(player: PlayerType): boolean {
    if (this.countPlayer() >= this.maxPlayers) {
      return false;
    }

    if (!this.players[0]) {
      this.players[0] = player;
    } else if (!this.players[1]) {
      this.players[1] = player;
    }

    if (this.countPlayer() === this.maxPlayers) {
      this.isFull = true;
      this.status = 'roomReady';
    }

    if (this.name === '') {
      this.name = `Room-${player!.gameName}`;
    }
    return true;
  }


  /**
   * Récupère un joueur dans la salle à partir de son identifiant unique.
   *
   * @param playerId - L'identifiant unique du joueur à rechercher.
   * @returns L'objet joueur s'il est trouvé ; sinon, retourne `undefined`.
   */
  getPlayerById(playerId: string): PlayerType | undefined {
    for (const player of this.players) {
      if (player?.playerId === playerId) {
        return player;
      }
    }
    return undefined;
  }


  /**
   * Recherche et retourne un joueur à partir de son identifiant client.
   *
   * Parcourt la liste des joueurs de la salle et retourne le joueur dont
   * l'identifiant client correspond à celui fourni en paramètre. Si aucun joueur
   * ne correspond, la fonction retourne `undefined`.
   *
   * @param clientId - L'identifiant unique du client à rechercher.
   * @returns Le joueur correspondant à l'identifiant client, ou `undefined` si aucun joueur n'est trouvé.
   */
  getPlayerByClientId(clientId: string): PlayerType | undefined {
    for (const player of this.players) {
      if (player?.clientId === clientId) {
        return player;
      }
    }
    return undefined;
  }

  /**
   * Crée une nouvelle instance du jeu Pong avec les deux joueurs actuels de la salle.
   * 
   * @returns {Pong | null} Retourne l'instance du jeu Pong si la création a réussi, sinon null.
   */
  createGame(): Pong | null {
    this.pong = new Pong(
      // this.players[0]?.playerId,
      // this.players[1]?.playerId
    );

    if (!this.pong) {
      return null;
    }

    return this.pong;
  }

  /**
   * Supprime un joueur de la salle en fonction de son identifiant.
   *
   * Si le type de jeu est 'localpvp' ou 'localpve', la partie en cours est arrêtée avant la suppression.
   * Si le joueur n'est pas trouvé dans la salle, une exception NotFoundError est levée.
   * Après suppression, la propriété `isFull` est mise à jour selon le nombre de joueurs restants.
   *
   * @param playerId - L'identifiant unique du joueur à supprimer.
   * @returns "roomEmpty" si la salle est vide après la suppression, sinon "playerRomoved".
   * @throws NotFoundError si le joueur n'est pas trouvé dans la salle.
   */
  removePlayer(playerId: string): "roomEmpty" | "playerRomoved" {
    if (this.typeGame === 'localpvp' || this.typeGame === 'localpve') {
      this.stopGame();
    }

    const playerIndex = this.players.findIndex(player => player?.playerId === playerId);
    if (playerIndex === -1) {
      throw new NotFoundError('Player');
    }
    // Remplace le joueur supprimé par undefined pour garder la paire [PlayerType, PlayerType]
    this.players[playerIndex] = undefined;

    this.isFull = this.countPlayer() >= this.maxPlayers;
    if (this.countPlayer() === 0) {
      return "roomEmpty";
    }
    return "playerRomoved";
  }

  /**
   * Démarre la session de jeu pour la salle courante.
   *
   * @throws {InternalServerError} Si l'instance du jeu (`pong`) n'est pas trouvée.
   *
   * @remarques
   * Cette méthode initialise la partie en appelant la méthode `start` sur l'instance `pong`
   * et met à jour le statut de la salle à `'playing'`.
   */
  startGame(): void {
    if (!this.pong) {
      throw new InternalServerError('Game not found');
    }
    this.pong.start();
    this.status = 'playing';
  }

  /**
   * Arrête la partie en cours si elle existe.
   *
   * Cette méthode vérifie d'abord si une instance de jeu (`pong`) est présente.
   * Si c'est le cas, elle appelle la méthode `stop()` sur cette instance pour arrêter la partie,
   * puis réinitialise la référence à `pong` à `null`. Elle met également à jour le statut de la salle
   * à 'finished' et indique que la salle n'est plus pleine.
   */
  stopGame() {
    if (!this.pong) {
      return;
    }
    this.pong.stop();
    this.pong = null;
    this.status = 'finished';
    this.isFull = false;
  }

  /**
   * Vérifie si la salle est disponible pour rejoindre.
   *
   * @returns {boolean} `true` si la salle n'est pas pleine et en attente, sinon `false`.
   */
  isJoinable(): boolean { return (!this.isFull && this.status === 'waiting'); }

  /**
   * Vérifie si la salle est prête à démarrer la partie.
   *
   * @returns {boolean} `true` si la salle est pleine ou si son statut est 'readyToStart', sinon `false`.
   */
  isReadyToStart(): boolean { return (this.isFull || this.status === 'readyToStart'); }

  userInfos(player: PlayerType) {
    return {
      playerId: player!.playerId,
      gameName: player!.gameName,
      joined: player!.joined
    };
  }

  userOpponentInfo(player: PlayerType) {
    const opponent = this.players.find(p => p && p.playerId !== player?.playerId);
    if (!opponent) return undefined;
    return {
      playerId: opponent.playerId,
      gameName: opponent.gameName,
      ready: opponent.ready
    };
  }

  roomData() {
    return {
      roomId: this.id,
      gameData: this.pong ? this.pong.toJSON() : null,
      typeGame: this.typeGame,
      players: this.players
    };
  }

  roomInfos(): RoomInfoType {
    return {
      roomId: this.id,
      typeGame: this.typeGame,
      players: [
        this.players[0]
          ? { playerId: this.players[0].playerId, gameName: this.players[0].gameName }
          : undefined,
        this.players[1]
          ? { playerId: this.players[1].playerId, gameName: this.players[1].gameName }
          : undefined,
      ] as RoomInfoType['players'],
    };
  }

  toJSON() {
    return {
      id: this.id,
      roomId: this.id,
      name: this.name,
      typeGame: this.typeGame,
      status: this.status,
      players: this.players.map(player => player ? {
        playerId: player.playerId,
        clientId: player.clientId,
        gameName: player.gameName,
        joined: player.joined,
        ready: player.ready,
      } : undefined),
      pong: this.pong ? this.pong.toJSON?.() ?? this.pong : null,
      isFull: this.isFull,
      createdAt: this.createdAt.toISOString(),
      maxPlayers: this.maxPlayers,
      playerReady: this.playerReady,
      private: this.private,
    };
  }
}
