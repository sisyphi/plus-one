import { getDailyWordGraph } from '$lib/server/word';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const timeZone = cookies.get('timeZone') || 'Etc/UTC';
	const data = getDailyWordGraph(timeZone);

	return {
		dailyWord: data.word,
		dailyGraph: data.graph.toJSON()
	};
};
