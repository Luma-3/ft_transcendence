import { renderPublicPage } from "../controllers/renderPage";
import { IApiResponse } from "../interfaces/IApiResponse";
import { fetchToken } from "./fetchToken";

export async function fetchApi<T>(url:string, option?: RequestInit, verifToken: boolean = true): Promise<IApiResponse<T>> {
	
	if (verifToken) {
		
		const token = await fetchToken();
		if (token.status === "error") {
			renderPublicPage('login', false);
			return {status: "error", message: "Session expired" };
		}
	}

	try {
		if(option && !option.headers)
			option.headers = {"Content-Type": "application/json"};
		const response = await fetch(url, {
			credentials: "include",
			...option,
		});
		if (!response.ok) {
			const errorData = await response.json();
			return {status: "error", message: errorData.message, details: errorData.details};
		}
		return response.json() as Promise<IApiResponse<T>>;
	} 
	catch (error) {
		renderPublicPage('500', false)
		return {status: "500", message: "Internal Server Error"}};
}

export async function fetchApiWithNoBody(url:string, option?: RequestInit) {
	try {
		const response = await fetch(url, {
			headers: {"Content-Type": "text/plain",
			},
			credentials: "include",
			...option,
		});
		if (!response.ok) {
			const errorData = await response.json();
			return {status: "error", message: errorData.message, details: errorData.details};
		}
		return { status: "success" };
	} 
	catch (error) {
		renderPublicPage('500', false)
		return {status: "500", message: "Internal Server Error"}};
}




