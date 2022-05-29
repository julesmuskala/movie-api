import Movie from "../types/movie";

const filterDuration = async (
	entries: Movie[],
	duration: number
): Promise<Movie[]> =>
	entries.filter(
		({ runtime }) => runtime >= duration - 10 && runtime <= duration + 10
	);

export default filterDuration;
