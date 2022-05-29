import HttpError from "../types/http-error";
import Movie from "../types/movie";

const filterGenres = async (
	entries: Movie[],
	targetEntries: string[],
	possibleGenres: string[]
): Promise<Movie[]> =>{
	// [index, matchedEntries]
	const frequency = new Array<[number, number]>;

	for (let i = 0; i < entries.length; ++i) {
		const entry = entries[i];
		// Every time movie genre matches target genre increment
		let matchedEntries = 0;

		const targetEntriesSet = new Set(targetEntries);

		if (targetEntriesSet.size !== targetEntries.length) {
			throw new HttpError("Provided genres query includes duplicated values", 400);
		}

		targetEntries.forEach((genre) => {
			if (entry.genres.includes(genre)) {
				++matchedEntries;
			}
			// TODO A bit slow
			if (!possibleGenres.includes(genre)) {
				throw new HttpError("Provided genres query includes unrecognized genre name", 400);
			}
		});

		// Prioritize entries that match all categories
		if (entry.genres.length === matchedEntries) {
			++matchedEntries;
		}

		// If movie matches searched genres
		if (matchedEntries) {
			frequency.push([i, matchedEntries]);
		}
	}

	const result: Movie[] = [];

	// Sort frequency array non-decreasingly
	// then push matched entries
	frequency.sort((l, r) => (r[1] - l[1])).forEach(elem => result.push(entries[elem[0]]));

	return result;
};

export default filterGenres;