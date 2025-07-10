import { getUserInfo } from "../../api/getterUser(s)";
import { alertTemporary } from "../../components/ui/alert/alertTemporary";
import { fadeIn, fadeOut } from "../../components/utils/fade";
import { removeLoadingScreen } from "../../components/utils/removeLoadingScreen";
import { setupColorTheme } from "../../components/utils/setColorTheme";
import { translatePage } from "../../controllers/Translate";
import { IUserInfo } from "../../interfaces/IUser";
import gameHtml from "../../pages/Game";
import { socket } from "../../socket/Socket";
import { onKeyDown, onKeyUp } from "./gameInput";
import { resizeCanvas } from "./utils/resizeCanvas";

const readyEventListener = (playerId: string) => {
  const payload = {
    service: 'game',
    scope: 'room',
    target: playerId,
    payload: {
      action: 'ready',
      data: {}
    }
  }
  socket!.send(JSON.stringify(payload));
}

export async function createGame(data: any) {

  console.log("createGame:", data)

  const user = await getUserInfo();
  if (user.status === "error" || !user.data) {
    return alertTemporary("error", "error-while-creating-game", "dark");
  }

  const lang = user.data.preferences!.lang ?? 'en';
  const theme = user.data.preferences!.theme ?? 'dark';

  fadeOut();

  setTimeout(async () => {
    const main_container = document.querySelector<HTMLDivElement>('#app')!;
    await addListenerEvent(data, user.data!);
    const newContainer = await gameHtml(data, user.data!.id);
    if (!newContainer) return;

    main_container.innerHTML = newContainer; // TODO Post event listener

    setupColorTheme(theme);
    translatePage(lang);
    removeLoadingScreen();
    fadeIn();
  }, 250);
}

async function addListenerEvent(data: any, user: IUserInfo) {

  window.addEventListener('resize', resizeCanvas)

  onkeyup = (event) => {
    onKeyUp(event, user.id);
  }

  onkeydown = (event) => {
    const divGame = document.getElementById("hiddenGame") as HTMLDivElement;

    if (divGame.classList.contains("opacity-0")) {
      readyEventListener(data.id);
    }
    onKeyDown(event, user.id);
  }
}

