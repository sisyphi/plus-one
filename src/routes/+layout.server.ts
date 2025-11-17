import { setTimeZoneCookie } from '$lib/server/timezone';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	setTimeZoneCookie(cookies);
};
