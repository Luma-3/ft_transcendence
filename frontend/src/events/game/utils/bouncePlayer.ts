import { IRoomData } from "../../../interfaces/IGame";

export function bouncePlayer(roomData: IRoomData) {
  for (const player of roomData.players) {
    if (player) {
      const ready = player.ready ? "ready" : "not-ready";
      if (ready === "ready") {
        const playerElement = document.getElementById(player.user_id);
        playerElement?.classList.add("animate-bounce");
      }
    }
  }
}
