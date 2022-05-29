import { Request, Response, NextFunction } from "express";

import Movie from "../types/movie";
import { readDB, filterGenres, filterDuration } from "../db";
import HttpError from "../types/http-error";

const getMovie = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { duration, genres } = req.query;

		const jsonData = await readDB();
		let result: null | Movie[] = null;

		if (duration) {
			result = await filterDuration(jsonData.movies, Number(duration));
		}

		if (genres) {
			const genreList = parseGenres(genres);

			result = await filterGenres(
				result ?? jsonData.movies,
				genreList,
				jsonData.genres
			);
		}

		// If no results found
		res.status(200).json(result ?? getRandomMovie(jsonData.movies));
	} catch (err) {
		next(err);
	}
};

const getRandomMovie = (movies: Movie[]) =>
	movies[Math.floor(Math.random() * movies.length)];

const parseGenres = (genres: any) => {
	if (!Array.isArray(genres)) {
		return [genres];
	}
	return genres;
};

export default getMovie;
