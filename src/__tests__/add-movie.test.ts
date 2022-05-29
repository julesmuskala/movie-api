import request from "supertest";

import app from "../app";

const baseUrl = "/api/v0/movies";
const newMovie = {
	title: "Blade Runner 2049",
	year: 2017,
	runtime: 163,
	genres: ["Thriller", "Drama", "Sci-Fi"],
	director: "Denis Villeneuve",
	actors: "Ryan Gosling, Harrison Ford, Ana de Armas, Sylvia Hoeks",
	posterUrl:
		"https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png",
};
const malformedMovie = {
	title: "Blade Runner 2049",
	year: 2017,
	genres: ["Thriller", "Drama", "Sci-Fi"],
	director: "Denis Villeneuve",
	actors: "Ryan Gosling, Harrison Ford, Ana de Armas, Sylvia Hoeks",
	posterUrl:
		"https://upload.wikimedia.org/wikipedia/en/9/9b/Blade_Runner_2049_poster.png",
};

describe(`POST ${baseUrl}`, () => {
	describe("given no request body", () => {
		test("should respond with a 400 status code", async () => {
			const response = await request(app).post(baseUrl);

			expect(response.statusCode).toBe(400);
		});
	});

	describe("given malformed request body", () => {
		test("should respond with a 400 status code", async () => {
			const response = await request(app).post(baseUrl).send(malformedMovie);
			expect(response.statusCode).toBe(400);
		});

		test("should specify text in the content type header", async () => {
			const response = await request(app).post(baseUrl).send(malformedMovie);

			expect(response.headers["content-type"]).toEqual(
				expect.stringContaining("text")
			);
		});

		test("should contain error message", async () => {
			const response = await request(app).post(baseUrl).send(malformedMovie);

			expect(response.text).toEqual(
				expect.stringContaining("Required value runtime not provided")
			);
		});
	});

	describe("given proper request body", () => {
		test("should respond with a 201 status code", async () => {
			const response = await request(app).post(baseUrl).send(newMovie);
			expect(response.statusCode).toBe(201);
		});

		test("should specify json in the content type header", async () => {
			const response = await request(app).post(baseUrl).send(newMovie);

			expect(response.headers["content-type"]).toEqual(
				expect.stringContaining("json")
			);
		});

		test("should contain elements corresponding to request body", async () => {
			const response = await request(app).post(baseUrl).send(newMovie);

			expect(response.body.id).toBeDefined();
			expect(response.body.title).toEqual(
				expect.stringMatching(newMovie.title)
			);
		});
	});
});
