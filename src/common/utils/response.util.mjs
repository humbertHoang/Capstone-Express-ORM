import { NODE_ENV } from "../constants/app.constant.mjs";
import { HTTP_STATUS } from "../constants/httpStatus.constant.mjs";

class ResponseBuilder {
  constructor(res) {
    if (!res?.status) throw new Error("Invalid Express response object");
    this.res = res;
    this.statusCode = HTTP_STATUS.OK;
    this.responseBody = {};
  }

  status(code) {
    if (typeof code === "number") {
      this.statusCode = code;
    }
    return this;
  }

  message(message) {
    this.responseBody.message = message;
    return this;
  }

  data(data) {
    if (data !== undefined && data !== null) {
      this.responseBody.data = data;
    }
    return this;
  }

  meta(meta) {
    if (meta !== undefined && meta !== null) {
      this.responseBody.meta = meta;
    }
    return this;
  }

  error(error) {
    if (error && NODE_ENV === "development") {
      this.responseBody.error = {
        message: error.message,
        stack: error.stack,
      };
    } else if (error && NODE_ENV === "production") {
      console.error(
        `[${this.statusCode}] ${this.responseBody.message || "Error"}`,
        {
          name: error.name,
          message: error.message,
        },
      );
    }
    return this;
  }

  send() {
    return this.res.status(this.statusCode).json(this.responseBody);
  }
}

export const responseSuccess = (
  res,
  data,
  message = "Success",
  statusCode = HTTP_STATUS.OK,
  meta = null,
) => {
  return new ResponseBuilder(res)
    .status(statusCode)
    .message(message)
    .data(data)
    .meta(meta)
    .send();
};

export const responseError = (
  res,
  message = "Internal Server Error",
  statusCode = HTTP_STATUS.INTERNAL_ERROR,
  error = null,
) => {
  return new ResponseBuilder(res)
    .status(statusCode)
    .message(message)
    .error(error)
    .send();
};

export const createResponse = (res) => {
  return new ResponseBuilder(res);
};
