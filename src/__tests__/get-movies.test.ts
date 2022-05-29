import request from "supertest";

import app from "../app";
import Movie from "../types/movie";

const baseUrl = "/api/v0/movies";

describe(`GET ${baseUrl}`, () => {
	describe("given no query params", () => {
		test("should respond with a 200 status code", async () => {
			const response = await request(app).get(baseUrl);

			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get(baseUrl);

			expect(response.headers["content-type"]).toEqual(
				expect.stringContaining("json")
			);
		});

		test("should be singular object with defined id field", async () => {
			const response = await request(app).get(baseUrl);

			expect(response.body.id).toBeDefined();
		});
	});

	describe("given query params", () => {
		const runtime = 200;
		const genres = ["History", "Comedy"]
		const url = `${baseUrl}?duration=${runtime}&${genres.map(s => `genres=${s}`).join('&')}`;

		test("should respond with a 200 status code", async () => {
			const response = await request(app).get(url);

			expect(response.statusCode).toBe(200);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).get(url);

			expect(response.headers["content-type"]).toEqual(
				expect.stringContaining("json")
			);
		});

		test("should contain elements corresponding to the params", async () => {
			const response = await request(app).get(url);

			expect(response.body).toBeInstanceOf(Array<Movie>);
			expect(matchElemRuntime(response.body, runtime)).toBe(true);
			expect(matchElemGenre(response.body, genres));
		});
	});

	describe("given malformed query param", () => {
		const runtime = 200;
		const genres = ["Histo"]
		const url = `${baseUrl}?duration=${runtime}&${genres.map(s => `genres=${s}`).join('&')}`;

		test("should respond with a 400 status code", async () => {
			const response = await request(app).get(url);

			expect(response.statusCode).toBe(400);
		});

		test("should specify text in the content type header", async () => {
			const response = await request(app).get(url);

			expect(response.headers["content-type"]).toEqual(
				expect.stringContaining("text")
			);
		});

		test("should contain elements corresponding to the params", async () => {
			const response = await request(app).get(url);
			expect(response.text).toEqual(
				expect.stringMatching("Provided genres query includes unrecognized genre name")
			);
		});
	});
});

const matchElemRuntime = (arr: Array<Movie>, duration: number) => {
	for (const elem of arr) {
		if (elem.runtime > duration + 10 && elem.runtime < duration - 10) {
			return false;
		}
	}

	return true;
};

const matchElemGenre = (arr: Array<Movie>, genres: string[]) => {
	for (const elem of arr) {
		expect(elem.genres.some(elem => genres.includes(elem))).toBe(true);
	}
}
