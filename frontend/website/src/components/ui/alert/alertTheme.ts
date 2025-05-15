import { getUserInfo } from "../../../api/getter";
import { alertTemporary } from "./alertTemporary";

export async function getCustomAlertTheme(needUser: boolean = true, theme: string = "dark") {
	let lang = sessionStorage.getItem('lang') || 'en';
	
	if (needUser) {
		const userInfo = await getUserInfo();
		if (userInfo.status === "error" || !userInfo.data) {
			alertTemporary("error", "Error while fetching user info", 'dark');
			return;
		}
		lang = userInfo.data.preferences.lang || 'en';
		theme = userInfo.data.preferences.theme;
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