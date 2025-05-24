export interface IApiResponse<T> {
	status: string, //Soit error soit success
	message: string,
	data?: T,
	details?: object,
};