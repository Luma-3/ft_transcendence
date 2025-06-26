import { alertPublic } from "../components/ui/alert/alertPublic";
import { handleGameSocketMessage } from "./DispatchMsgSocket";
import { renderPublicPage } from "./renderPage";

export let socket: WebSocket;
const MAX_RECONNECT_TENTATIVE = 5;
let reconnectTentative = 0;

export function socketConnection() {
  socket = new WebSocket('/api/ws');

  socket.addEventListener("open", () => {
    reconnectTentative = 0;
    console.log("WebSocket connection established.");
  });

  socket.addEventListener("message", (e) => {
    const data = JSON.parse(e.data);

    const from = JSON.parse(e.data).from;
    switch (from) {
      case 'game':
        handleGameSocketMessage(data.payload);
        break;
      default:
        break;
    }
  });

  socket.addEventListener('error', () => {
    alertPublic("WebSocket connection error. Trying to reconnect... Try " + reconnectTentative + " of " + MAX_RECONNECT_TENTATIVE, "error");

    socket.close();
    if (reconnectTentative < MAX_RECONNECT_TENTATIVE) {
      reconnectTentative++;
      socketConnection();
    } else {
      alertPublic("WebSocket connection failed. Please log in again.", "error");
      reconnectTentative = 0;

      setTimeout(() => { window.location.href = "/login"; }, 1000);
    }
  });

  socket.addEventListener('close', (event) => {
    if (event.wasClean) {
      console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
      alertPublic(`WebSocket connection closed unexpectedly with code ${event.code}. Message: ${event.reason}. You will be redirected to the main page.`, "error");
      setTimeout(() => { renderPublicPage("home") }, 2000);
    }
  });

}
