import { fetchApi } from './fetch';
import { IApiResponce } from './interfaces/IApiResponse';


export async function patchUserInfo(routeElementToUpdate: string, elementUpdate: any, elementToUpdate: string ): Promise<IApiResponce<any>> {
	const response = await fetchApi(routeElementToUpdate , {
		method: "PATCH",
		body: JSON.stringify({
			[elementToUpdate] : elementUpdate,
		})
	});
	return response;
}