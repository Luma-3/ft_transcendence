import { IRoomData } from "../../../interfaces/IGame";

export async function bouncePlayer(roomData: IRoomData) {
  console.log("Bouncing players...");
  for (const player of roomData.players) {
    if (player) {
      const ready = player.ready ? "ready" : "not-ready";
      if (ready === "ready") {
        const playerElement = document.getElementById(player.id);
        playerElement?.classList.add("animate-bounce");
      }
    }
  }
}