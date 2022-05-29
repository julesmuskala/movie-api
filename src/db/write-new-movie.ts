import { writeFile } from "fs/promises";

import HttpError from "../types/http-error";
import DB from "../types/db";
import Movie from "../types/movie";
import readDB from "./read-db";

const writeNewMovie = async (newMovie: Movie, memoDB?: DB) => {
	const db = memoDB ?? (await readDB());
	db.movies.push(newMovie);
	try {
		const content = JSON.stringify(db);
		await writeFile(`${__dirname}/data/db.json`, content);
	} catch (err) {
		throw new HttpError(String(err));
	}
};

export default writeNewMovie;
