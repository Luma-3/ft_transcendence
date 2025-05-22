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

    playerOrder.forEach((uid) => {
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
    socket.send(JSON.stringify({ action: "error", message: "uuid required" }));
    socket.close();
    return null;
  }

  if (Object.keys(players).length >= MAXPLAYERS) {
    socket.send(JSON.stringify({ type: "error", message: "Salle pleine" }));
    socket.close();
    return null;
  }

  if (players[uid]) {
    socket.send(JSON.stringify({ type: "error", message: "uuid already connected" }));
    socket.close();
    return null;
  }

  players[uid] = socket;
  playerOrder.push(uid);
  console.log(`Joueur connecté : ${uid}`);

  startGameIfReady();
  return uid;
}

export async function launchGame(connection, req) {
  console.log("connection: ", connection);

  const socket = connection.socket;
  let playerId = null;

  console.log("Client connecté via WebSocket");
  socket.send("OK");

  /*socket.on("message", (msg) => {
    let parsed;
    try {
      parsed = JSON.parse(msg);
    } catch {
      socket.send(JSON.stringify({ action: "error", message: "JSON invalide" }));
      socket.close();
      return;
    }

    if (parsed.action === "init") {
      const result = init_all(socket, parsed);
      if (!result) {
        socket.send(JSON.stringify({ action: "error", message: "Initialisation échouée" }));
        socket.close();
        return;
      }
      playerId = result;
      return;
    }

    if (parsed.action === "move") {
      if (!playerId || !game) return;

      const dir = parsed.data?.direction;
      const player = playerId === game.player1.uid ? game.player1 : game.player2;

      if (dir === "up") player.speed = -5;
      else if (dir === "down") player.speed = 5;
      else player.speed = 0;

      player.move_player(game.top, game.bottom);

      broadcast({
        action: "state",
        data: JSON.parse(game.step())
      }, players);

      if (game.gameOver) {
        const winner = game.player1.score === 11 ? game.player1.uid : game.player2.uid;
        broadcast({ action: "end", message: `Joueur ${winner} a gagné.` }, players);
      }
    }
  });

  socket.on("close", () => {
    if (playerId) {
      console.log(`Player disconnected : ${playerId}`);
      delete players[playerId];
      const idx = playerOrder.indexOf(playerId);
      if (idx !== -1) playerOrder.splice(idx, 1);
      delete playersState[playerId];
      broadcast({
        action: "end",
        message: `Player ${playerId} has been disconnected`
      }, players);
    }
  });*/
}
