import { Pong } from '../game/Pong.js';

const MAXPLAYERS = 2;
let game = null;
let players = {};        // uid -> websocket
let playerOrder = [];
let playersState = {};

function broadcast(data, players) {
  const msg = JSON.stringify(data);
  for (const [uid, player] of Object.entries(players)) {
    try {
      if (player.readyState === player.OPEN) {
        player.send(msg);
      }
    } catch (err) {
      console.error(`Erreur lors de l'envoi au joueur ${uid} :`, err);
    }
  }
}

function startGameIfReady() {
  if (playerOrder.length === MAXPLAYERS) {
    game = new Pong(playerOrder[0], playerOrder[1]);

    playerOrder.forEach((uid, index) => {
      players[uid].send(JSON.stringify({
        type: "start",
        data: {
          yourId: uid,
          players: [...playerOrder]
        }
      }));
      playersState[uid] = { direction: "stop", y: 0 };
    });

    game.start();
    console.log("Jeu démarré avec :", playerOrder);
  }
}

function init_all(socket, request) {
  const uid = request.data.uuid;
  if (!uid) {
    connection.socket.send(JSON.stringify({ action: "error", message: "uuid required" }));
    connection.socket.close();
    return null;
  }

  if (Object.keys(players).length >= MAXPLAYERS) {
    connection.socket.send(JSON.stringify({ type: "error", message: "Salle pleine" }));
    connection.socket.close();
    return null;
  }

  if (players[uid]) {
    connection.socket.send(JSON.stringify({ type: "error", message: "uuid already connected" }));
    connection.socket.close();
    return null;
  }

  connection.socket.extra.playerId = uid;
  players[uid] = socket;
  playerOrder.push(uid);
  console.log(`Joueur connecté : ${uid}`);

  startGameIfReady();
  return uid;
}

export async function getGame(connection, request) {
  connection.socket.on("message", (msg) => {
    let request;

    try {
      request = JSON.parse(msg);
    } catch {
      connection.socket.send(JSON.stringify({ action: "error", message: "JSON Invalide" }));
      connection.socket.close();
      return;
    }

    if (request.action === "init") {
      const result = init_all(socket, request);
      if (!result) {
        connection.socket.send(JSON.stringify({ action: "error", message: "Player not initialised" }));
        connection.socket.close();
      }
      return;
    }

    if (request.action === "move") {
      const dir = request.data.direction;
      const player = connection.socket.extra.playerId === game.player1.uid ? game.player1 : game.player2;

      if (dir === "up") player.speed = -5;
      else if (dir === "down") player.speed = 5;
      else player.speed = 0;

      player.mouv_player(game.top, game.bottom);
      broadcast({
        action: "state",
        data: JSON.parse(game.step())
      }, players);

      if (game.gameOver) {
        const winner = game.player1.score == 11 ? game.player1.uid : game.player2.uid;
        broadcast({ action: "end", message: `Joueur ${winner} a gagné.` }, players);
      }
    }
  });

  connection.socket.on("close", () => {
    if (connection.socket.extra.playerId) {
      console.log(`Player disconnected : ${connection.socket.extra.playerId}`);
      delete players[connection.socket.extra.playerId];
      const idx = playerOrder.indexOf(connection.socket.extra.playerId);
      if (idx !== -1) playerOrder.splice(idx, 1);
      delete playersState[connection.socket.extra.playerId];
      broadcast({
        action: "end",
        message: `Player ${connection.socket.extra.playerId} has been disconnected`
      }, players);
    }
  });
}
