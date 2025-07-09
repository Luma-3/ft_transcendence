import { fetchApi, fetchApiWithNoError } from "./fetch";
import * as API from "./routes";
import { alert } from "../components/ui/alert/alert";
import { alertPublic } from "../components/ui/alert/alertPublic";
import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { renderPublicPage } from "../controllers/renderPage";
import { loadTranslation } from "../controllers/Translate";
import { IOtherUser, IUserInfo, IUserPreferences, UserSearchResult } from "../interfaces/IUser";

export class FetchInterface {
	private constructor() {}

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
				alertPublic(trad[response.message] ?? response.message, "error");
				return false;
			}
		return true;
	}

	/**
	 * ! Create Session
	 */
	public static async createSession(user: { username: string, password: string} ) {
		const response = await fetchApiWithNoError(API.API_SESSION.CREATE, {
				method: "POST", 
				body: JSON.stringify(user)
			});
			
			switch (response.code) {
				case 460 :
					renderPublicPage('2FALogin');
					return false;

				case 461:
					renderPublicPage('verifyEmail');
					return false;

				default: 
					if (response.status === "error") {
						alertPublic("username-or-password-incorrect", "error");
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
			const response = await fetchApiWithNoError(API.API_SESSION.CREATE, { method: 'PUT',
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

		return response.data ?? undefined;
	}

	public static async getUserPrefs() {
		const response = await fetchApiWithNoError<IUserPreferences>(API.API_USER.BASIC.ONLY_PREFERENCES, {
			method: "GET",
		});
		return response.data ?? undefined;
	}

	/**
	 * ! Get public infos of a user
	 */
	public static async getOtherUserInfo(id: string): Promise<IUserInfo| undefined> {
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
	 * ! Update Username
	 */
	public static async updateUsername(newUsername: string) {
		
		const response = await fetchApiWithNoError(API.API_USER.UPDATE.USERNAME , {
		method: "PATCH",
		body: JSON.stringify({
			"username" : newUsername,
		})
		});

		return response.status !== "error";
	}

	/**
	 * ! Update Email
	 */
	public static async updateEmail(newEmail: string) {
		
		const response = await fetchApiWithNoError(API.API_USER.UPDATE.EMAIL , {
		method: "PATCH",
		body: JSON.stringify({
			"email" : newEmail,
		})
		});

		return response.status !== "error"; 
	}
	/**
	 * ! Delete User
	 */
	public static async deleteUser() {

		const confirmResponse = await alert("are-you-sure", "warning");
		
		if (confirmResponse) {
			const response = await fetchApi(API.API_USER.BASIC.DELETE, {
				method: 'DELETE',
				headers: {
					"Content-Type": "text/plain",
				}
			});
	
			if (response.status === "error") {
				return alert("cannot-delete-user", "error");
			}
			window.location.href = '/';
		}
	}
	/**
	 * ! Change / Update Password
	 */
	public static async updatePassword(oldPassword: string, newPassword: string, trad: any, customTheme: any) {
		const response = await fetchApiWithNoError(API.API_USER.UPDATE.PASSWORD, {
						method: "PATCH",
						body: JSON.stringify({
							oldPassword: oldPassword,
							password: newPassword,
						}),
					});
					if (response.status === "success") {
						return await alertTemporary("success", trad['password-changed'], customTheme.theme);
						;
					}

					return await alertTemporary("error", trad['error-while-changing-password'], customTheme.theme);
		}
	/**
	 * ! Update Preferences
	 */
	public static async updatePreferences(ElementToUpdate: string, newValue: string) {
			const response = await fetchApi(API.API_USER.UPDATE.PREF.ALL, {
					method: 'PATCH',
					body: JSON.stringify({
						[ElementToUpdate]: newValue,
					}),
				});
				if (response.status === "error") {
					return alertTemporary("error", "Error while changing " + ElementToUpdate, "error");
				}
		}

	/**
	 * ! Get all of my friends
	 */
	//TODO: Verifier si response.data est toujours present, pour mieux gerer les erreurs serveur
	public static async getFriends() {
		const response = await fetchApi<IOtherUser[]>(API.API_USER.SOCIAL.FRIENDS);
		return response.data ?? undefined;
	}

	/**
	 * ! Accept Friend Request
	 */
	public static async acceptFriendRequest(user: IUserInfo, friendId: string, action: "send" | "accept") {
		const response = await fetchApiWithNoError(API.API_USER.SOCIAL.NOTIFICATIONS + `${(action == "send" ? "" : "/accept")}/${friendId}`, {
				method: "POST",
				body: JSON.stringify({
					friendId: friendId,
				})
			});
			
			if (response.status === "error") {
				(action === "send") ? alertTemporary("error", "issues-with-friend-invitation", user.preferences.theme, true)
																		: alertTemporary("error", "issues-with-friend-acceptance", user.preferences!.theme, true);
				return false;
			}

			if (action === "send") {
				alertTemporary("success", "friend-invitation-sent", user.preferences!.theme, true);
				return false
			}

			return true;
	}

	/**
	 * ! Refuse Friend Request
	 */
	public static async cancelFriendRequest(user: IUserInfo, friendId: string) {
		
		const response = await fetchApiWithNoError(API.API_USER.SOCIAL.NOTIFICATIONS + `/${friendId}`, {
		method: "DELETE",
		body: JSON.stringify({})
	});
	if (response.status === "error") {
		await alertTemporary("error", "issues-with-invitation-cancelled", user.preferences.theme, true);
		return false;
	}
	return true;
	}

	/**
	 * ! Cancel Friend Request
	 */
	public static async removeFriendRequest(user: IUserInfo, friendId: string) {

		const response = await fetchApiWithNoError(API.API_USER.SOCIAL.NOTIFICATIONS + `/refuse/${friendId}`, {
			method: "DELETE",
			body: JSON.stringify({})
		});
		if (response.status === "error") {
			 await alertTemporary("error", "issues-with-invitation-refused", user.preferences!.theme, true);
			 return false;
		}
		return true;
	}

	/**
	 * ! Remove Friend
	 */
	public static async removeFriend(user: IUserInfo, friendId: string) {

		const response = await fetchApiWithNoError(API.API_USER.SOCIAL.FRIENDS + `/${friendId}`, {
			method: "DELETE",
			body: JSON.stringify({})
		});
		if (response.status === "error") {
			return alertTemporary("error", "issues-with-friend-removal", user.preferences.theme, true);
		}
		
		alertTemporary("success", "friend-removed", user.preferences!.theme, true);
	}

	/**
	 * ! Block User
	 */
	public static async blockUser(user: IUserInfo, blockId: string, isBlocking: boolean) {
		
		const response = await fetchApiWithNoError(API.API_USER.SOCIAL.BLOCKED + `/${blockId}`, {
			method: isBlocking ? "DELETE" : "POST",
			body: JSON.stringify({})
		});
		if (response.status === "error") {
			await alertTemporary("error", "issues-with-blocking-user", user.preferences.theme, true);
			return false;
		}
		await alertTemporary("success", isBlocking ? "user-unblocked" : "user-blocked", user.preferences.theme, true);
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
	 * ! Resend Verification Email
	 */
	public static async resendVerificationEmail(email: string, lang: string) {
		
		const response = await fetchApiWithNoError(API.MODULE_TWOFA.RESEND_EMAIL, {
			method: 'POST',
			body: JSON.stringify({ email, lang })
		});
		console.log("Response from resendVerificationEmail:", response);
		if (response.status === "error") {
			await alertTemporary("error", "email-already-sent", "dark");
			return false;
		}

		await alertTemporary("success", "email-sent-successfully", "dark");
		return true;
	}
}
