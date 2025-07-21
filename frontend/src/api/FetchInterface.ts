import { fetchApi, fetchApiWithNoError } from "./fetch";
import * as API from "./routes";
import { alert } from "../components/ui/alert/alert";
import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { render2FaPages, renderPublicPage } from "../controllers/renderPage";
import { loadTranslation } from "../controllers/Translate";
import { IOtherUser, IUserInfo, IUserPreferences, UserSearchResult } from "../interfaces/IUser";
import { IApiResponse } from "../interfaces/IApi";
import { startEmailCooldown } from "../components/utils/sendEmail";
import { updateAllLists } from "../pages/Friends/Lists/updatersList";
import { updateNavbar } from "../components/ui/navbar";
import { IRankInfo } from "../pages/Dashboard/rankBadges";

export class FetchInterface {
  private constructor() { }

  /**
   * ! Register
   */
  public static async registerUser(userData: {
    username: string, password: string, passwordVerif: string, email: string, preferences: { lang: string }
  }): Promise<Boolean> {

    const response = await fetchApiWithNoError(API.API_USER.BASIC.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    if (response.status !== "success") {
      const trad = await loadTranslation(userData.preferences.lang);
      alert("error", trad[response.message] ?? response.message);
      return false;
    }
    return true;
  }

  /**
   * ! Log Out User
   */
  public static async logOutUser() {

    const confirmResponse = await alert("warning", "are-you-sure", true);
    if (confirmResponse) {
      const responseApi = await fetchApiWithNoError(API.API_SESSION.DELETE, {
        method: 'DELETE',
        headers: {
          "Content-Type": "text/plain",
          credentials: 'include',
        },
        body: "",
      });
      if (responseApi.status === "error") {
        return alert("error", "cannot-log-out", true);
      }
      window.location.href = "/";
    }
  }

  /**
   * ! Create Session
   */
  public static async createSession(user: { username: string, password: string }) {
    const response = await fetchApiWithNoError(API.API_SESSION.CREATE, {
      method: "POST",
      body: JSON.stringify(user)
    });

    switch (response.code) {
      case 460:
        render2FaPages('login');
        return false;

      case 461:
        renderPublicPage('verifyEmail');
        startEmailCooldown();
        return false;

      default:
        if (response.status === "error") {
          alert("error", "username-or-password-incorrect");
          renderPublicPage('login');
          return false;
        }
        return true;
    }
  }

  /**
   * ! Verification de la session 
   */
  public static async verifySession() {
    const response = await fetchApiWithNoError(API.API_SESSION.VERIFY_ACCESS, { method: 'GET' });
    if (response.status === "success") {
      return true;
    }
    return this.refreshSession();

  }

  public static async refreshSession() {
    const response = await fetchApiWithNoError(API.API_SESSION.CREATE, {
      method: 'PUT',
      headers: {
        "Content-Type": "text/plain",
      }
    })
    return (response.status !== "error");
  }

  /**
   * ! Verification de session + Recuperation des informations du user
   */
  public static async getUserInfo(): Promise<IUserInfo | undefined> {

    const success = await this.verifySession();
    if (!success) {
      window.location.href = 'login';
    }

    const response = await fetchApi<IUserInfo>(API.API_USER.BASIC.INFOS + "?includePreferences=true", {
      method: "GET",
    });
    if (response.status === "error" || !response.data) {
      await alertTemporary("error", "error-while-fetching-user-infos", false);
      return undefined;
    }
    return response.data;
  }

  public static async getUserPrefs() {
    const response = await fetchApiWithNoError<IUserPreferences>(API.API_USER.BASIC.ONLY_PREFERENCES, {
      method: "GET",
    });
    if (response.status === "error" || !response.data) {
      await alertTemporary("error", "error-while-fetching-user-infos", false);
      return undefined;
    }
    return response.data;
  }

  /**
   * ! Get public infos of a user
   */
  public static async getOtherUserInfo(id: string): Promise<IUserInfo | undefined> {
    const response = await fetchApi<IUserInfo>(API.API_USER.BASIC.BASIC + `/${id}?includePreferences=true`);
    if (response.status === "error") {
      return undefined;
    }
    return response.data ?? undefined;
  }

  /**
   * ! Get All Users 
   */
  public static async getAllUser(blocked: ("you" | "another" | "all" | "none") = "none", friends: boolean = false, pending: boolean = false, page: number = 1, limit: number = 10, hydrate: boolean = true) {

    const response = await fetchApi<UserSearchResult>(API.API_USER.BASIC.BASIC + `?blocked=${blocked}&friends=${friends}&pending=${pending}&limit=${limit}&page=${page}&hydrate=${hydrate}`);

    return response.data ?? undefined;
  }

  /**
   * ! Delete User
   */
  public static async deleteUser() {

    const confirmResponse = await alert("warning", "are-you-sure", true);

    if (confirmResponse) {
      const response = await fetchApi(API.API_USER.BASIC.DELETE, {
        method: 'DELETE',
        headers: {
          "Content-Type": "text/plain",
        }
      });

      if (response.status === "error") {
        return alert("error", "cannot-delete-user", true);
      }
      window.location.href = '/';
    }
  }

  /**
   * ! Update Preferences
   */
  public static async updatePreferences(elementToUpdate: string, newElementValue: string): Promise<boolean> {
    const response = await fetchApiWithNoError(API.API_USER.UPDATE.PREF.ALL, {
      method: "PATCH",
      body: JSON.stringify({
        [elementToUpdate]: newElementValue,
      })
    });
    return response.status !== "error";
  }

  /**
   * ! Change / Update Password
   */
  public static async updatePassword(oldPassword: string, newPassword: string) {
    const response = await fetchApiWithNoError(API.API_USER.UPDATE.PASSWORD, {
      method: "PATCH",
      body: JSON.stringify({
        oldPassword: oldPassword,
        password: newPassword,
      }),
    });
    if (response.status === "error") {
      return alertTemporary("error", 'wrong-password', true);
    }
    return alertTemporary("success", 'password-updated', true);
  }

  /**
   * ! Verify Email
   */
  public static async verifyEmailUser(token: string) {

    const response = await fetchApiWithNoError(API.TWOFA.EMAIL + `/${token}`, {
      method: "GET",
    });
    if (response.status === "error") {
      await alert("error", "cannot-verify-email-too-old-mail-or-retry-registration-process");
      window.location.href = "/register";
      return;
    }
    await alertTemporary("success", "email-verified-successfully");
    window.location.href = "/login";
  }

  /**
   * ! Update Email
   */
  public static async updateEmail(newEmail: string): Promise<boolean> {
    const response = await fetchApiWithNoError(API.API_USER.UPDATE.EMAIL, {
      method: "PATCH",
      body: JSON.stringify({
        email: newEmail,
      }),
    });
    if (response.status === "error") {
      return false;
    }
    return true;
  }

  /**
   * ! Update Username
  */
  public static async updateUsername(newUsername: string): Promise<number | undefined> {
    const response = await fetchApiWithNoError(API.API_USER.UPDATE.USERNAME, {
      method: "PATCH",
      body: JSON.stringify({
        username: newUsername,
      }),
    });
    return response.code;
  }

  /**
   * ! Get all of my friends
   */
  public static async getFriends() {
    const response = await fetchApi<IOtherUser[]>(API.API_USER.SOCIAL.FRIENDS);
    return response.data ?? undefined;
  }

  /**
   * ! Search Users in all users
   */
  public static async getSearchUsers(q: string, page: number = 1, limit: number = 10, hydrate: boolean = true): Promise<IApiResponse<UserSearchResult>> {
    const response = await fetchApi<UserSearchResult>(API.API_USER.SEARCH + `?q=${q}&page=${page}&limit=${limit}&hydrate=${hydrate}&blocked="all"`);
    return response;
  }

  /**
   * ! Accept Friend Request
   */
  public static async acceptFriendRequest(friendId: string, action: "send" | "accept") {
    const response = await fetchApiWithNoError(API.API_USER.SOCIAL.NOTIFICATIONS + `${(action == "send" ? "" : "/receiver")}/${friendId}`, {
      method: "POST",
      body: JSON.stringify(action == "send" ? {
        friendId: friendId,
      } : {})
    });

    if (response.status === "error") {
      (action === "send")
        ? alertTemporary("error", "issues-with-friend-invitation", true)
        : alertTemporary("error", "issues-with-friend-acceptance", true);
      return false;
    }

    if (action === "send") {
      alertTemporary("success", "friend-invitation-sent", true);
      return true
    }

    return true;
  }

  /**
   * ! Refuse Friend Request
   */
  public static async cancelFriendRequest(friendId: string) {

    const response = await fetchApiWithNoError(API.API_USER.SOCIAL.NOTIFICATIONS + `/${friendId}`, {
      method: "DELETE",
      body: JSON.stringify({})
    });
    if (response.status === "error") {
      alertTemporary("error", "issues-with-invitation-cancelled", true);
      return false;
    }
    return true;
  }

  /**
   * ! Cancel Friend Request
   */
  public static async removeFriendRequest(friendId: string) {

    const response = await fetchApiWithNoError(API.API_USER.SOCIAL.NOTIFICATIONS + `/receiver/${friendId}`, {
      method: "DELETE",
      body: JSON.stringify({})
    });
    if (response.status === "error") {
      alertTemporary("error", "issues-with-invitation-refused", true);
      return false;
    }
    return true;
  }

  /**
   * ! Remove Friend
   */
  public static async removeFriend(friendId: string) {

    const response = await fetchApiWithNoError(API.API_USER.SOCIAL.FRIENDS + `/${friendId}`, {
      method: "DELETE",
      body: JSON.stringify({})
    });
    if (response.status === "error") {
      return alertTemporary("error", "issues-with-friend-removal", true);
    }

    alertTemporary("success", "friend-removed", true);
  }

  /**
   * ! Block User
   */
  public static async blockUser(blockId: string, isBlocking: boolean) {

    const response = await fetchApiWithNoError(API.API_USER.SOCIAL.BLOCKED + `/${blockId}`, {
      method: isBlocking ? "DELETE" : "POST",
      body: JSON.stringify({})
    });
    if (response.status === "error") {
      alertTemporary("error", "issues-with-user-blocked", true);
      return false;
    }
    alertTemporary("success", isBlocking ? "user-unblocked" : "user-blocked", true);
    return true;
  }

  /**
   * ! Get users blocked by myself 
   */
  public static async getBlockedUser() {
    const response = await fetchApi<IOtherUser[]>(API.API_USER.SOCIAL.BLOCKED + "?hydrate=true");
    return response.data ?? undefined;
  }

  /**
   * ! Get Notifications
   */
  public static async getNotifications(params: "sender" | "receiver" = "sender") {
    const response = await fetchApi<IOtherUser[]>(API.API_USER.SOCIAL.NOTIFICATIONS + `?action=${params}`);
    return response.data ?? undefined;
  }

  /**
   * ! Get Waiting Game
   */
  public static async getWaitingGame(typeGame: string | null) {
    if (!typeGame) {
      return false;
    }
    const response = await fetchApiWithNoError(API.API_GAME.GET_ALL_DATA + `player/${typeGame}`, {
      method: 'GET',
    });
    return response.status === "success";
  }

  /**
   * ! Cancel Waiting Game
   */
  public static async cancelWaitingGame() {
    const gameType = sessionStorage.getItem("gameType");
    if (!gameType) {
      return false;
    }
    const response = await fetchApiWithNoError(API.API_GAME.GET_ALL_DATA + `player/${gameType}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    });
    if (response.status === "success") {
      sessionStorage.removeItem("gameType");
      if (await updateNavbar()) {
        alertTemporary("success", "game-cancelled-successfully", true);
      }
    }
    return response.status === "success";
  }

  /**
   * ! Get Game Invitation
   */
  public static async getGameInvitations(params: "sender" | "receiver" = "sender") {
    const response = await fetchApi<{ id: string }[]>(API.API_GAME.NOTIFICATIONS + `?action=${params}`, {
      method: 'GET',
    });
    return response.data ?? undefined;
  }

  /**
   * ! Resend Verification Email
   */
  public static async resendVerificationEmail(email: string, lang: string) {

    const response = await fetchApiWithNoError(API.TWOFA.EMAIL, {
      method: 'PATCH',
      body: JSON.stringify({ email, lang })
    });
    if (response.status === "error") {
      await alert("error", "email-already-sent", false);
      return false;
    }
    return true;
  }

  public static async changeState2FA(state: boolean): Promise<boolean> {
    const response = await fetchApiWithNoError<{ twofa: boolean }>(API.API_USER.TWOFA, {
      method: state ? 'PUT' : 'DELETE',
    });
    if (response.status === "error") {
      alertTemporary("error", state ? "cannot-activate-2fa" : "cannot-desactivate-2fa", true);
      return false;
    }
    return true;
  }

  /**
   * ! Send 2Fa
   */
  //USER: get / PUT sur User pour demander activation et DELETE pour desactivation
  public static async submit2FACode(code: string, method: 'GET' | 'PUT' | 'DELETE'): Promise<boolean> {
    /**
     * * Verification du code 2FAs
     */
    const response = await fetchApiWithNoError(method === 'GET' ? API.API_2FA.SEND : API.TWOFA.TWOFA, {
      method: 'POST',
      body: JSON.stringify({ code })
    });
    if (response.status === 'error') {
      alertTemporary("error", "invalid-2fa-code", false);
      return false;
    }
    alertTemporary("success", "2fa-code-verified", false);
    return true;
  }

  /**
 * ! 2FA Verification
 */
  public static async verify2FA(): Promise<boolean> {
    const response = await fetchApiWithNoError<{ twofa: boolean }>(API.API_USER.TWOFA, {
      method: 'GET',
    });
    if (response.status === "error" || !response.data) {
      return false;
    }
    return response.data.twofa;
  }

  /**
   * ! Activate 2FA
   */
  public static async activate2FA(): Promise<boolean> {
    const response = await fetchApiWithNoError(API.API_USER.TWOFA, {
      method: 'PUT',
      headers: { "Content-Type": "text/plain" }
    });
    if (response.status === "error") {
      alertTemporary("error", "cannot-activate-2fa", true);
      return false;
    }
    return true;
  }

  /**
   * ! Deactivate 2FA
   */
  public static async desactivate2FA(): Promise<boolean> {
    const response = await fetchApiWithNoError(API.API_USER.TWOFA, {
      method: 'DELETE',
      headers: { "Content-Type": "text/plain" }
    });
    if (response.status === "error") {
      alertTemporary("error", "cannot-desactivate-2fa", true);
      return false;
    }
    return true;
  }

  /**
   * ! Send TwoFA Code
   */
  public static async createGameInServer(FormInfos: IGameFormInfo) {
    const response = await fetchApiWithNoError<{ id: string }>(API.API_GAME.CREATE + `/${FormInfos.gameType}`, {
      method: 'POST',
      body: JSON.stringify({
        playerName: FormInfos.playerName,
        roomName: FormInfos.roomName,
      }),
    });
    if (response.status === "error") {
      return false;
    }
    return true;
  }

  public static async inviteToPlay(_gameFormInfo: IGameFormInfo, invitePlayerId: string) {
    const response = await fetchApiWithNoError(API.API_GAME.INVITE + `/${invitePlayerId}`, {
      method: 'POST',
      body: JSON.stringify({
        roomName: _gameFormInfo.roomName,
        gameType: _gameFormInfo.gameType
      })
    });
    if (response.status === "error") {
      alertTemporary("error", "failed-to-send-invitation", true);
      return false;
    }
    alertTemporary("success", "player-invited", true);
    return true;
  }

  public static async acceptGameInvitation(element?: HTMLElement, otherId?: string): Promise<boolean> {
    const id = element?.dataset.id || otherId;
    if (!id) {
      return false;
    }
    const response = await fetchApiWithNoError(API.API_GAME.INVITE + `/receiver/${id}`, {
      method: 'POST',
      body: JSON.stringify({})
    });
    if (response.status === "error") {
      alertTemporary("error", "issues-with-invitation-acceptance", true);
      return false;
    }
    return true;
  }

  public static async refuseGameInvitation(element: HTMLElement): Promise<boolean> {
    const id = element.dataset.id;
    if (!id) {
      return false;
    }
    const response = await fetchApiWithNoError(API.API_GAME.INVITE + `/receiver/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    });
    if (response.status === "error") {
      alertTemporary("error", "issues-with-invitation-refusal", true);
      return false;
    }

    await updateAllLists();
    return true;
  }

  public static async cancelGameInvitation(element: HTMLElement): Promise<boolean> {
    const id = element.dataset.id;
    if (!id) {
      return false;
    }

    const response = await fetchApiWithNoError(API.API_GAME.INVITE + `/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    });
    if (response.status === "error") {
      alertTemporary("error", "issues-with-invitation-cancellation", true);
      return false;
    }
    return true;
  }

  public static async getRank(userID: string) {
    const response = await fetchApiWithNoError(API.API_GAME.RANK + `/${userID}`, {
      method: 'GET'
    });
    if (response.status === "error") {
      return undefined;
    }
    return response.data;
  }
}

export interface IGameFormInfo {
  playerName: string;
  roomName: string;
  gameType: string;
}
