export default class HttpError extends Error {
	status: number;
	message: string;

	constructor(message: string, status = 500) {
		super(message);
		this.status = status;
		this.message = message;
	}
}
