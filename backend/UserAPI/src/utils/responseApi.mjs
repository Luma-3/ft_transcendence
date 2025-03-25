export class replyApi {
	constructor() {
		this.success = false;
		this.data = null;
		this.error = null;
		return this;
	}

	sendError(reply, code, error) {
		this.success = false;
		this.error = error;
		reply.code(code).send(this);
	}

	sendData(reply, code, data) {
		this.success = true;
		this.data = data;
		reply.code(code).send(this);
	}
}