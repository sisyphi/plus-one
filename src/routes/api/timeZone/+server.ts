import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { timeZone } = await request.json();

	return new Response(null, {
		status: 204,
		headers: {
			'Set-Cookie': `timeZone=${encodeURIComponent(timeZone)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`
		}
	});
};
