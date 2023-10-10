export class DarkRuneError extends Error {
	constructor(message = '') {
		super(message);
		this.message = message;
	}
}
