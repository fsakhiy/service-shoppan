class Response {
  status: boolean;
  message: string;
  data: any;
  meta: any;
  error: any;

  constructor(
    status: boolean,
    message: string,
    data: any,
    meta: any,
    error: any,
  ) {
    (this.status = status),
      (this.message = message),
      (this.data = data),
      (this.meta = meta),
      (this.error = error);
  }
}

class SuccessResponse extends Response {
  constructor(message: string, data: any = null, meta: any = null) {
    super(true, message, data, meta, null);
  }
}

class FailedResponse extends Response {
  constructor(message: string, error: any = null) {
    super(false, message, null, null, error);
  }
}

export { Response, SuccessResponse, FailedResponse };
