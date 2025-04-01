interface IApiResponce<T> {
	success: boolean;
	data?: T;
	error?: {
		status: number;
		message: string;
		details?: any;
	}
};

export async function fetchApi<T>(url:string, option?: RequestInit): Promise<IApiResponce<T>> {
	try {
		const response = await fetch(url, {
			headers: {"Content-Type": "application/json"},
			...option,
		});
		return response.json() as Promise<IApiResponce<T>>;
	} 
	catch (error) {
		console.error("Error:" + error);
		return {success: false, error: {status: 500, message: "Internal Server Error"}};
	}
}
