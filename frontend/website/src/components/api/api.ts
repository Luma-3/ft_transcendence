interface IApiResponce<T> {
	status: string, //Soit error soit success
	message: string,
	data?: T,
	details?: object,
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
		//TODO: Faire erreur a ma sauce
		//TODO: Faire page erreur 500 mais aussi pour le 404
		return {status: "500", message: "Internal Server Error"}};
}