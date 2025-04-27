import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET,
} from "../common/constants/app.constant.mjs";
import {
  BadRequestException,
  UnauthorizedException,
} from "../common/middlewares/error.middleware.mjs";
import prisma from "../common/prisma/init.prisma.mjs";
import { cookieParser } from "../common/helpers/cookie-parser.helper.mjs";
export const authService = {
  register: async (req) => {
    const { email, mat_khau, ho_ten, tuoi } = req.body;
    const existUser = await prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });
    if (existUser) {
      throw new BadRequestException(`User already exists`);
    }
    const hashedPassword = await bcrypt.hash(mat_khau, 10);
    const newUser = await prisma.nguoi_dung.create({
      data: {
        email,
        mat_khau: hashedPassword,
        ho_ten,
        tuoi: +tuoi,
      },
    });
    delete newUser.mat_khau;
    return newUser;
  },

  login: async (req, res) => {
    const { email, mat_khau } = req.body;
    const user = await prisma.nguoi_dung.findFirst({
      where: {
        email,
      },
    });
    if (!user) throw new BadRequestException(`User not found`);
    const isPasswordMatch = bcrypt.compareSync(mat_khau, user.mat_khau);
    if (!isPasswordMatch) throw new BadRequestException(`Invalid credentials`);
    const { accessToken, refreshToken } = authService.generateToken(
      user.nguoi_dung_id,
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
    });
    delete user.mat_khau;
    return {
      user: {
        id: user.nguoi_dung_id,
        email: user.email,
        name: user.ho_ten,
        age: user.tuoi,
      },
      tokenMeta: {
        accessTokenExpiry: new Date(
          Date.now() + ACCESS_TOKEN_EXPIRES_IN * 1000,
        ),
        refreshTokenExpiry: new Date(
          Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000,
        ),
      },
    };
  },
  logout: async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
  },
  refreshToken: async (req, res) => {
    const reqCookies = cookieParser(req.headers.cookie);
    const refreshToken = req.headers.authorization.split(" ")[1];
    const accessToken = reqCookies.accessToken;
    if (!refreshToken) throw new UnauthorizedException(`Unauthorized`);
    if (!accessToken) throw new UnauthorizedException(`Unauthorized`);
    const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });
    if (decodeRefreshToken.id !== decodeAccessToken.id) {
      throw new UnauthorizedException(`Unauthorized`);
    }
    const user = await prisma.nguoi_dung.findFirst({
      where: { nguoi_dung_id: decodeRefreshToken.id },
    });
    if (!user) throw new UnauthorizedException(`Unauthorized`);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      authService.generateToken(user.nguoi_dung_id);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
    });

    return {
      tokenMeta: {
        accessTokenExpiry: new Date(
          Date.now() + ACCESS_TOKEN_EXPIRES_IN * 1000,
        ),
        refreshTokenExpiry: new Date(
          Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000,
        ),
      },
    };
  },

  generateToken: (userId) => {
    if (!userId) throw new BadRequestException(`User not found`);
    const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: ACCESS_TOKEN_EXPIRES_IN * 1000,
    });
    const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: REFRESH_TOKEN_EXPIRES_IN * 1000,
    });
    return { accessToken, refreshToken };
  },
};
