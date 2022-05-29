import HttpError from "./http-error";

interface MovieOptionalFields {
	actors?: string;
	plot?: string;
	posterUrl?: string;
}

export default class Movie {
	id: number;
	title: string; // 255 chars max
	year: number;
	runtime: number;
	genres: string[];
	director: string; // 255 chars max
	actors?: string;
	plot?: string;
	posterUrl?: string;

	constructor(
		id: number,
		title: string,
		year: number,
		runtime: number,
		genres: string[],
		director: string,
		optionalFields: MovieOptionalFields
	) {
		this.id = id;
		this.title = title;
		this.year = year;
		this.runtime = runtime;
		this.genres = genres;
		this.director = director;
		this.actors = optionalFields.actors;
		this.plot = optionalFields.plot;
		this.posterUrl = optionalFields.posterUrl;
	}
}

interface ValidMovieTemplate {
	title: string;
	year: number;
	runtime: number;
	genres: string[];
	director: string;
	actors?: string;
	plot?: string;
	posterUrl?: string;
}

export const validateMovie = (object: any, possibleGenres: string[]) => {
	if (typeof object !== "object" && !Array.isArray(object)) {
		throw new HttpError("Request body must be JSON", 400);
	}

	checkStringField(object, "title", true, 255);
	// Lumiere brothers presented first movie in 1895
	checkNumberField(object, "year", 1895, 2050);
	checkNumberField(object, "runtime", 0);
	checkGenreField(object, possibleGenres);
	checkStringField(object, "director", true, 255);
	checkStringField(object, "actors", false);
	checkStringField(object, "plot", false);
	checkStringField(object, "posterUrl", false);

	return object as ValidMovieTemplate;
};

const checkField = (
	object: any,
	fieldName: string,
	fieldType: string,
	required = true
) => {
	if (!required) {
		if (!(fieldName in object)) return;
	}
	if (!(fieldName in object)) {
		throw new HttpError(`Required value ${fieldName} not provided`, 400);
	}
	if (typeof object[fieldName] !== fieldType) {
		throw new HttpError(`Provided ${fieldName} value is not ${fieldType}`, 400);
	}
};

const checkStringField = (
	object: any,
	fieldName: string,
	required = true,
	maxLength?: number
) => {
	checkField(object, fieldName, "string", required);
	if (maxLength && object[fieldName].length > maxLength) {
		throw new HttpError(
			`Provided ${fieldName} value exceeds limit of ${maxLength} chars`,
			400
		);
	}
};

const checkNumberField = (
	object: any,
	fieldName: string,
	min: number,
	max?: number,
	required = true
) => {
	checkField(object, fieldName, "number", required);
	if (object[fieldName] < min) {
		throw new HttpError(
			`Provided ${fieldName} value must not be less than ${min}`,
			400
		);
	}
	if (max && object[fieldName] > max) {
		throw new HttpError(
			`Provided ${fieldName} value must not be greater than ${max}`,
			400
		);
	}
};

const checkGenreField = async (object: any, possibleGenres: string[]) => {
	const fieldName = "genres";

	checkField(object, fieldName, "object");
	if (!Array.isArray(object[fieldName])) {
		throw new HttpError(`Provided genres value is not array`, 400);
	}
	for (const val of object[fieldName]) {
		if (typeof val !== "string") {
			throw new HttpError(`Provided genres value is not array of strings`, 400);
		}
		// TODO A bit slow
		if (!possibleGenres.includes(val)) {
			throw new HttpError(
				`Provided genres value includes unrecognized genre name`,
				400
			);
		}
	}
};
