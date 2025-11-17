import type { Cookies } from '@sveltejs/kit';
import { getUserTimezone } from '$lib/utils/datetime';

export function setTimeZoneCookie(cookies: Cookies): string {
	const timeZone = getUserTimezone();

	cookies.set('timeZone', timeZone, {
		path: '/',
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 365
	});

	return timeZone;
}
