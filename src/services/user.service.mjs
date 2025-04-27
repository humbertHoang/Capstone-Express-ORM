import { Prisma } from "@prisma/client";
import { BadRequestException } from "../common/middlewares/error.middleware.mjs";
import prisma from "../common/prisma/init.prisma.mjs";
import {
  isValidEmail,
  normalizeEmail,
} from "../common/validators/email.validator.mjs";

export const userService = {
  getInfo: async function (req) {
    delete req.user.mat_khau;
    return req.user;
  },

  uploadImage: async (req) => {
    const { file, user } = req;
    const mo_ta = req.body.mo_ta;
    if (!file) {
      throw new BadRequestException(`File is required`);
    }
    const nguoi_dung_id = Number(user?.nguoi_dung_id);
    if (!nguoi_dung_id) throw new BadRequestException("Invalid user ID");

    await prisma.hinh_anh.create({
      data: {
        ten_hinh: file.originalname,
        duong_dan: `images/${file.filename}`,
        mo_ta,
        nguoi_dung_id,
      },
    });
    return {
      folder: file.destination,
      fileName: file.filename,
      imgUrl: `images/${file.filename}`,
    };
  },

  uploadAvatar: async (req) => {
    const { file, user } = req;
    if (!file) {
      throw new BadRequestException(`File is required`);
    }
    const nguoi_dung_id = Number(user?.nguoi_dung_id);
    if (!nguoi_dung_id) throw new BadRequestException("Invalid user ID");
    await prisma.nguoi_dung.update({
      where: { nguoi_dung_id: nguoi_dung_id },
      data: { anh_dai_dien: file.filename },
    });
    return {
      folder: file.destination,
      fileName: file.filename,
      imgUrl: `images/${file.filename}`,
    };
  },

  getPinnedImages: async (req) => {
    const nguoi_dung_id = Number(req.user?.nguoi_dung_id);
    if (!nguoi_dung_id) throw new BadRequestException("Invalid user ID");

    const luuAnh = await prisma.luu_anh.findMany({
      where: {
        nguoi_dung_id: nguoi_dung_id,
      },
      include: {
        hinh_anh: {
          select: {
            hinh_id: true,
            duong_dan: true,
            ten_hinh: true,
            mo_ta: true,
          },
        },
      },
      orderBy: {
        ngay_luu: "desc",
      },
    });
    return luuAnh;
  },
  getCreatedImages: async (req) => {
    const nguoi_dung_id = Number(req.user?.nguoi_dung_id);
    if (!nguoi_dung_id) throw new BadRequestException("Invalid user ID");
    const hinhAnh = await prisma.hinh_anh.findMany({
      where: {
        nguoi_dung_id: nguoi_dung_id,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return hinhAnh;
  },

  editInfo: async (req) => {
    const userID = Number(req.user?.nguoi_dung_id);
    if (!userID) throw new BadRequestException("Invalid user ID");
    const user = await prisma.nguoi_dung.findUnique({
      where: { nguoi_dung_id: userID },
    });
    if (!user) throw new BadRequestException("User not found");
    let { ho_ten, email, tuoi } = req.body;
    tuoi = +tuoi;
    if (typeof ho_ten !== "string" || !ho_ten.trim()) {
      throw new BadRequestException("Invalid name");
    }
    if (typeof tuoi !== "number" || tuoi < 0) {
      throw new BadRequestException("Invalid age");
    }
    const normalizedEmail = normalizeEmail(email);
    if (!isValidEmail(normalizedEmail))
      throw new BadRequestException("Invalid email");
    let updateUser;
    try {
      updateUser = await prisma.nguoi_dung.update({
        where: { nguoi_dung_id: userID },
        data: {
          ho_ten,
          email: normalizedEmail,
          tuoi,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new BadRequestException("Email already in use");
      }
      throw error;
    }
    delete updateUser.mat_khau;
    return updateUser;
  },
};
