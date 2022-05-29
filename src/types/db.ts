import Movie from "./movie";

export default interface DB {
	genres: string[];
	movies: Movie[];
}
