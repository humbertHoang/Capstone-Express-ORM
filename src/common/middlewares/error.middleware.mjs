import jwt from "jsonwebtoken";
import multer from "multer";
import { HTTP_STATUS } from "../constants/httpStatus.constant.mjs";
import { responseError } from "../utils/response.util.mjs";
const errorHandler = (err, req, res, next) => {
  console.log({ err });
  if (err instanceof jwt.JsonWebTokenError) {
    err.code = HTTP_STATUS.UNAUTHORIZED;
  }
  if (err instanceof jwt.TokenExpiredError) {
    err.code = HTTP_STATUS.FORBIDDEN;
  }
  if (err instanceof jwt.NotBeforeError) {
    err.code = HTTP_STATUS.FORBIDDEN;
  }
  if (err instanceof multer.MulterError) {
    err.code = HTTP_STATUS.BAD_REQUEST;
  }
  responseError(res, err.message, err.code, err);
};

class BadRequestException extends Error {
  constructor(
    message = `BadRequestException`,
    statusCode = HTTP_STATUS.BAD_REQUEST,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ForbiddenException extends Error {
  constructor(
    message = `ForbiddenException`,
    statusCode = HTTP_STATUS.FORBIDDEN,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

class UnauthorizedException extends Error {
  constructor(
    message = `UnauthorizedException`,
    statusCode = HTTP_STATUS.UNAUTHORIZED,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export {
  BadRequestException,
  errorHandler,
  ForbiddenException,
  UnauthorizedException,
};
