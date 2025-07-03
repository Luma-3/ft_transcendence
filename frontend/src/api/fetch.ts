import { IApiResponse } from "../interfaces/IApi";

export async function fetchApi<T>(url: string, option?: RequestInit): Promise<IApiResponse<T>> {
	try {
		if (option && !option.headers)
			option.headers = { "Content-Type": "application/json" };
		const response = await fetch(url, {
			credentials: "include",
			...option,
		});

		let responseData: any = null;
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			responseData = await response.json();
		}

		if (!response.ok || responseData?.status === "error") {
			window.location.href = "/error?status=" + response.status + "&message=" + encodeURIComponent(responseData?.message || "Unknown error");
		}

		return { ...responseData, code: response.status } as IApiResponse<T>;
	}
	catch (error) {
		window.location.href = "/error?status=500&message=" + encodeURIComponent("Internal Server Error");
		return { status: "error", message: "Internal Server Error" } as IApiResponse<T>;
	}
}

export async function fetchApiWithNoError<T>(url: string, option?: RequestInit): Promise<IApiResponse<T>> {
	try {
		if (option && !option.headers)
			option.headers = { "Content-Type": "application/json" };
		const response = await fetch(url, {
			credentials: "include",
			...option,
		});
		let responseData: any = null;
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			responseData = await response.json();
		}
		if (responseData?.status === "error") {
			return { status: "error", code: response.status, message: responseData.message, details: responseData.details || {} };
		}
		return { ...responseData, code: response.status } as IApiResponse<T>;
	}
	catch (error) {
		return { status: "error", code: 500, message: "Internal Server Error" };
	}
}
