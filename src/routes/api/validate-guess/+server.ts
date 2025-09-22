import { isOneLetterApart, isWordValid, type WordData } from '$lib/helper';
import type { RequestHandler } from '@sveltejs/kit';

import wordDataJson from '$lib/data/plus_one.json';

export const POST: RequestHandler = async ({ request }) => {
	const { prevAnswer, guess } = await request.json();

	if (prevAnswer && prevAnswer.length + 1 !== guess.length) {
		return new Response(JSON.stringify({ valid: false, reason: 'NOT_ONE_LETTER_LONGER' }), {
			status: 200
		});
	}
	if (prevAnswer && !isOneLetterApart(prevAnswer, guess)) {
		return new Response(JSON.stringify({ valid: false, reason: 'NOT_ONE_LETTER_APART' }), {
			status: 200
		});
	}
	if (!isWordValid(guess, wordDataJson as WordData)) {
		return new Response(JSON.stringify({ valid: false, reason: 'NOT_IN_DICTIONARY' }), {
			status: 200
		});
	}

	return new Response(JSON.stringify({ valid: true }));
};
