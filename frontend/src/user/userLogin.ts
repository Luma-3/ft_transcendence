import { renderErrorPage, renderPrivatePage } from '../controllers/renderPage'

import { alertPublic } from '../components/ui/alert/alertPublic';

import { User } from '../interfaces/User';
import { API_SESSION } from '../api/routes';
import { socketConnection } from '../controllers/Socket';
import { fetchApi } from '../api/fetch';

export async function loginUser() {

  /**
   * Validation du formulaire de connexion
   * Verification si le formulaire est pas corrompu
   */
  const form = document.forms.namedItem("LoginForm") as HTMLFormElement | null;
  if (!form) { return; }

  const formData = new FormData(form);
  const userdata = Object.fromEntries(formData) as Record<string, string>;

  if (userdata.username === "" || userdata.password === "") {
    return;
  }

  /**
   * Creation de session
   */
  const response = await fetchApi<User>(API_SESSION.CREATE,
    { method: "POST", body: JSON.stringify(userdata) }, false)

  if (response.status === "error") {
    alertPublic("username-or-password-incorrect", "error");
    return;
  }

  /**
   * Creation du socket qui sera bien utile pour le pong
   * le chat et toutes communications bidirectionnelles
   * entre le client et le serveur qui ont besoin d'etre en temps reel
   */
  socketConnection();

  /**
   * Page de ReWelcome (car l'utilisateur a deja un compte)
   */
  renderPrivatePage('dashboard');
}
