import startingWordsTxt from '$lib/data/starting_words.txt?raw';
import { randElement } from '$lib/helper';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const startingWords = startingWordsTxt.replaceAll('\r', '').split('\n');
	const startingWord: string = randElement(startingWords);

	console.log('GET api/starting-word: ', startingWord);

	return new Response(
		JSON.stringify({
			data: startingWord
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
