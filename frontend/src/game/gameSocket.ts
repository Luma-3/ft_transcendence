import { renderGame } from "../components/renderPage";
import { drawGame } from "./gameDraw";

export function handleGameSocketMessage(data: any) {
  drawGame(data.payload);

}
