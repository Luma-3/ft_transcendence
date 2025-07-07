import { fetchApi, fetchApiWithNoError } from "./fetch";
import * as API from "./routes";
import { alert } from "../components/ui/alert/alert";
import { alertPublic } from "../components/ui/alert/alertPublic";
import { alertTemporary } from "../components/ui/alert/alertTemporary";
import { renderPublicPage } from "../controllers/renderPage";
import { loadTranslation } from "../controllers/Translate";
import { IUserInfo } from "../interfaces/IUser";
import { IApiResponse } from "../interfaces/IApi";

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
			const refresh = this.refreshSession();
			if (!refresh) {
				return false;
			}
			return true;
		}

		public static async refreshSession() {
				const response = await fetchApiWithNoError(API.API_SESSION.CREATE, { method: 'PUT',
					headers: {
						"Content-Type": "text/plain",
					}
				})
				if (response.status === "error") {
					return false;
				}
				return true;
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


	public static async getOtherUserInfo(id: string): Promise<IUserInfo| undefined> {
		const response = await fetchApi<IUserInfo>(API.API_USER.BASIC.BASIC + `/${id}?includePreferences=true`);
		if (response.status === "error") {
			return undefined;
		}
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

		if (response.status === "error") {
			return false;
		}

		return true;
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

		if (response.status === "error") {
			return false;
		}

		return true;
	}
	/**
	 * ! Delete User
	 */
	static async deleteUser() {

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

	static async updatePassword(oldPassword: string, newPassword: string, trad: any, customTheme: any) {
		const response = await fetchApiWithNoError(API.API_USER.UPDATE.PASSWORD, {
						method: "PATCH",
						body: JSON.stringify({
							oldPassword: oldPassword,
							password: newPassword,
						}),
					});
					if (response.status === "success") {
						alertTemporary("success", trad['password-changed'], customTheme.theme);
						return;
					} 
				
					alertTemporary("error", trad['error-while-changing-password'], customTheme.theme);
		}
}
