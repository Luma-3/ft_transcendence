import { FetchInterface } from "../../../api/FetchInterface";
import { alertTemporary } from "./alertTemporary";

export async function getCustomAlertTheme(
	needUser: boolean = false,
): Promise<{
	theme: string;
	lang: string;
	bg: string;
	text: string;
	icon: string;
	confirmButtonColor: string;
	cancelButtonColor: string;
} | undefined> {
	let lang = localStorage.getItem('lang') || 'en';
	let theme = 'dark';

	if (needUser) {
		const user = await FetchInterface.getUserInfo()
		if (user === undefined) {
			return;
		}
		lang = user.preferences.lang ?? 'en';
		theme = user.preferences.theme ?? 'dark';
	}
	const bg = theme === 'dark' ? '#000000' : '#FFFFFF';
	const text = theme === 'dark' ? '#F8E9E9' : '#000000';
	const icon = theme === 'dark' ? '#FF8904' : '#E3B1AE';
	const confirmButtonColor = theme === 'dark' ? '#744FAC' : '#E3B1AE';
	const cancelButtonColor = theme === 'dark' ? '#FF8904' : '#000000';
	return {
		theme,
		lang,
		bg,
		text,
		icon,
		confirmButtonColor,
		cancelButtonColor,
	};
}