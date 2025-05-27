import { alertPublic } from "../components/ui/alert/alertPublic";
import { handleGameSocketMessage } from "../game/gameSocket";
import { drawGame } from "../game/gameDraw";

export let socket: WebSocket | null = null;

export function createSocketConnection() {
  socket = new WebSocket('/api/ws');

  socket.addEventListener("open", () => {
    console.log("WebSocket connection established successfully.");
  });
  socket.addEventListener("message", (e) => {
    console.log(e.data);
    const message = e.data;
    drawGame(message);
  });

  socket.addEventListener('error', (event) => {
    alertPublic("WebSocket error: " + event, "error");
  });

  socket.addEventListener('close', (event) => {
    if (event.wasClean) {
      console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
      console.error(`WebSocket connection closed unexpectedly, code=${event.code}`);
    }
  });

}
