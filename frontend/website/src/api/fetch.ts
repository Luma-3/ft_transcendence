import { renderPublicPage } from "../components/renderPage";
import { IApiResponce } from "./interfaces/IApiResponse";
import { fetchToken } from "./fetchToken";

export async function fetchApi<T>(url:string, option?: RequestInit): Promise<IApiResponce<T>> {
	
	const token = await fetchToken();
	if (token.status === "error") {
		renderPublicPage('login', false);
		return {status: "error", message: "Session expired" };
	}

	try {
		const response = await fetch(url, {
			headers: {"Content-Type": "application/json",
			},
			credentials: "include",
			...option,
		});
		if (!response.ok) {
			const errorData = await response.json();
			return {status: "error", message: errorData.message, details: errorData.details};
		}
		return response.json() as Promise<IApiResponce<T>>;
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

export async function fetchWithNoToken<T>(url:string, option?: RequestInit): Promise<IApiResponce<T>> {
	try {
		const response = await fetch(url, {
			headers: {"Content-Type": "application/json",
			},
			credentials: "include",
			...option,
		});
		if (!response.ok) {
			const errorData = await response.json();
			return {status: "error", message: errorData.message, details: errorData.details};
		}
		return response.json() as Promise<IApiResponce<T>>;
	} 
	catch (error) {
		renderPublicPage('500', false)
		return {status: "500", message: "Internal Server Error"}};
}




