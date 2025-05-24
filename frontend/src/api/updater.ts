import { fetchApi } from './fetch';
import { IApiResponse } from './interfaces/IApiResponse';


export async function patchUserInfo(routeElementToUpdate: string, elementUpdate: any, elementToUpdate: string ): Promise<IApiResponse<any>> {
	const response = await fetchApi(routeElementToUpdate , {
		method: "PATCH",
		body: JSON.stringify({
			[elementToUpdate] : elementUpdate,
		})
	});
	return response;
}