export class HttpError extends Error {
  constructor(code, msgLong, msgShort) {
    super();
    this.code = code || this.constructor.defaultCode;
    this.msgShort = msgShort || this.constructor.defaultMsgShort;
    this.msgLong = msgLong || this.constructor.defaultMsgLong || '';
    this.status = this.constructor.status;
    // For compatibility with the Error class:
    this.message = this.msgLong || this.msgShort || this.code;
  }

  toPlainObject() {
    return {
      status: this.status,
      code: `#${this.code}`,
      short: this.msgShort,
      long: this.msgLong,
    };
  }
}

export class HttpBadRequestError extends HttpError {}
HttpBadRequestError.status = 400;
HttpBadRequestError.defaultCode = 'badRequest';
HttpBadRequestError.defaultMsgShort = 'Bad request.';

export class Http404Error extends HttpError {}
Http404Error.status = 404;
Http404Error.defaultCode = 'notFound';
Http404Error.defaultMsgShort = 'Page not found.';
Http404Error.defaultMsgLong = 'This endpoint does not exist.';

export class HttpInternalServerError extends HttpError {}
HttpInternalServerError.status = 500;
HttpInternalServerError.defaultCode = 'genericError';
HttpInternalServerError.defaultMsgShort = 'Something went wrong.';
HttpInternalServerError.defaultMsgLong = 'Something went wrong. Please contact the administrator.';

export class HttpBadGatewayError extends HttpError {}
HttpBadGatewayError.status = 502;
HttpBadGatewayError.defaultCode = 'badGatewayError';
HttpBadGatewayError.defaultMsgShort = 'Bad gateway.';
HttpBadGatewayError.defaultMsgLong = 'Invalid response from an upstream server.';

export class HttpConflictError extends HttpError {}
HttpConflictError.status = 409;
HttpConflictError.defaultCode = 'conflict';
HttpConflictError.defaultMsgShort = 'Conflicting data.';
HttpConflictError.defaultMsgLong = 'Data sent does not match with data expected.';
