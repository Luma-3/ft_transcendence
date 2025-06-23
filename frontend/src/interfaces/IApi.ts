export interface IApiResponse<T> {
	status: string, //Soit error soit success
	code?: number,
	message: string,
	data?: T,
	details?: object,
};