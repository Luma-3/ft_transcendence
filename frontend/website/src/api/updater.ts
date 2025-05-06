import { fetchApi } from './fetch';
import { IApiResponce } from './interfaces/IApiResponse';


export async function patchUserInfo(routeElementToUpdate: string, elementToUpdate: any): Promise<IApiResponce<any>> {
	const response = await fetchApi(routeElementToUpdate , {
		method: "PATCH",
		body: JSON.stringify({
			...elementToUpdate
		})
	});
	return response;
}