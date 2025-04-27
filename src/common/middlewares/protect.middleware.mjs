import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constants/app.constant.mjs";
import prisma from "../prisma/init.prisma.mjs";
import { UnauthorizedException } from "./error.middleware.mjs";

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) throw new UnauthorizedException(`Unauthorized`);
    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    const user = await prisma.nguoi_dung.findUnique({
      where: { nguoi_dung_id: decode.id },
    });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }
  try {
    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedException(`Unauthorized`);
    const decode = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await prisma.nguoi_dung.findUnique({
      where: { nguoi_dung_id: decode.id },
    });
    req.user = user;
  } catch {
    req.user = null;
  }
  next();
};
