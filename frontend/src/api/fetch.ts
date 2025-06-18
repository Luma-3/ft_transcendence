import { renderErrorPage, renderPublicPage } from "../controllers/renderPage";
import { IApiResponse } from "../interfaces/IApiResponse";

export async function fetchApi<T>(url:string, option?: RequestInit): Promise<IApiResponse<T>> {
	
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

		const responseData = await response.json();
		return responseData as Promise<IApiResponse<T>>;
	} 
	catch (error) {
		renderErrorPage('500', '500', 'Internal Server Error');
		return {status: "500", message: "Internal Server Error"};
	}
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




