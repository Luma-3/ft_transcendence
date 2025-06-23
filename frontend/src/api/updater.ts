import { fetchApi, fetchApiWithNoError } from './fetch';
import { IApiResponse } from '../interfaces/IApi';


export async function patchUserInfo(routeElementToUpdate: string, elementUpdate: any, elementToUpdate: string ): Promise<IApiResponse<any>> {
	const response = await fetchApiWithNoError(routeElementToUpdate , {
		method: "PATCH",
		body: JSON.stringify({
			[elementToUpdate] : elementUpdate,
		})
	});
	return response;
}