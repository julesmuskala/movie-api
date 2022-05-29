import { Request, Response, NextFunction } from "express";

import Movie, { validateMovie } from "../types/movie";
import { readDB, writeNewMovie } from "../db";

export const addMovie = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const jsonData = await readDB();

		// Validate request body
		const validMovie = validateMovie(req.body, jsonData.genres);
		// New ID will be incremented ID of last movies element
		const newID = jsonData.movies[jsonData.movies.length - 1].id + 1;
		const newMovie = new Movie(
			newID,
			validMovie.title,
			validMovie.year,
			validMovie.runtime,
			validMovie.genres,
			validMovie.director,
			{
				plot: validMovie.plot,
				posterUrl: validMovie.posterUrl,
				actors: validMovie.actors,
			}
		);

		await writeNewMovie(newMovie, jsonData);
		res.status(201).json(newMovie);
	} catch (err) {
		next(err);
	}
};

export default addMovie;
