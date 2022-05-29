import { Request, Response, NextFunction } from "express";

import HttpError from "../types/http-error";

const errorHandler = (
	err: HttpError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.status === 500) {
		console.error(err.message);
	}
	res.status(400).send(err.message);
};

export default errorHandler;
