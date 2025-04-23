import { alertChangePasword } from "../../components/ui/alert";

export async function changeUserPassword() {

	const response = await alertChangePasword();
	console.log(response);
	return ;
}