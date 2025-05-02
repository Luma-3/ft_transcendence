import { renderPage } from "../renderers/renderPage";
import { IApiResponce } from "./interfaces/IApiResponse";

export async function fetchApi<T>(url:string, option?: RequestInit): Promise<IApiResponce<T>> {
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
		renderPage('500', false)
		return {status: "500", message: "Internal Server Error"}};
}
