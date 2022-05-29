import { readFile } from "fs/promises";

import DB from "../types/db";
import HttpError from "../types/http-error";

const readDB = async (): Promise<DB> => {
	try {
		const result = await readFile(`${__dirname}/data/db.json`, "utf8");
		return JSON.parse(result);
	} catch (err) {
		throw new HttpError(String(err));
	}
};

export default readDB;
