import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { tz } = await request.json();

	return new Response(null, {
		status: 204,
		headers: {
			'Set-Cookie': `tz=${encodeURIComponent(tz)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`
		}
	});
};
