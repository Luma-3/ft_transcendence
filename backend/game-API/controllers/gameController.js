
import Pong from '../game/Pong.js';
import { WebSocketServer } from 'ws';

const MAXPLAYERS = 2;
let game;

function broadcast(data, players) {
  const msg = JSON.stringify(data);
  Object.values(players).forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) ws.send(msg);
  });
}

function startGameIfReady(playerOrder, players, playersState) {
  if (playerOrder.length === MAXPLAYERS) {
    playerOrder.forEach((pid, index) => {
      players[pid].send(JSON.stringify({
        type: "start",
        payload: { playerId: index + 1, pid }
      }));
      playersState[pid] = { direction: "stop", y: 0 };
    });

    game = new Pong(playerOrder[0], playerOrder[1]);
    game.start();
    console.log("Jeu démarré avec :", playerOrder);
  }
}

export async function getGame() {
  const wss = new WebSocketServer({ port: 3003 });

  let players = {};        // uid -> ws
  let playerOrder = [];
  let playersState = {};

  wss.on("connection", (ws) => {
    let playerPid = null;

    ws.on("message", (msg) => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch {
        ws.send(JSON.stringify({ type: "error", message: "JSON invalide" }));
        return;
      }

      if (data.type === "init") {
        const pid = data.payload.pid;

        if (!pid) {
          ws.send(JSON.stringify({ type: "error", message: "uid requis" }));
          ws.close();
          return;
        }

        if (Object.keys(players).length >= MAXPLAYERS) {
          ws.send(JSON.stringify({ type: "error", message: "Salle pleine" }));
          ws.close();
          return;
        }

        if (players[pid]) {
          ws.send(JSON.stringify({ type: "error", message: "uid déjà connecté" }));
          ws.close();
          return;
        }

        playerPid = pid;
        players[pid] = ws;
        playerOrder.push(pid);
        console.log(`Joueur connecté : ${pid}`);

        ws.send(JSON.stringify({ type: "init_ack", payload: { pid } }));
        startGameIfReady(playerOrder, players, playersState);
        return;
      }

      if (!playerPid) {
        ws.send(JSON.stringify({ type: "error", message: "Init manquant" }));
        return;
      }

      if (data.type === "move") {
        const dir = data.payload.direction;
        const player = playerPid === game.player1.uid ? game.player1 : game.player2;

        if (dir === "up") player.speed = -5;
        else if (dir === "down") player.speed = 5;
        else player.speed = 0;

        game.mouv_player(player);
        game.step();

        broadcast({
          type: "state",
          payload: JSON.parse(game.step())
        }, players);
      }
    });

    ws.on("close", () => {
      if (playerPid) {
        console.log(`Joueur déconnecté : ${playerPid}`);
        delete players[playerPid];
        const idx = playerOrder.indexOf(playerPid);
        if (idx !== -1) playerOrder.splice(idx, 1);
        delete playersState[playerPid];
        broadcast({ type: "end", payload: { message: `Joueur ${playerPid} a quitté.` } }, players);
      }
    });
  });
};
