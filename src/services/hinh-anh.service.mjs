import fs from "fs";
import path from "path";
import { BadRequestException } from "../common/middlewares/error.middleware.mjs";
import prisma from "../common/prisma/init.prisma.mjs";

export const hinhAnhService = {
  findAll: async function (req) {
    let { page, pageSize, search } = req.query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 10;
    search = search || "";

    const hinhAnh = await prisma.hinh_anh.findMany({
      where: {
        OR: [
          {
            ten_hinh: {
              contains: search,
            },
          },
          {
            mo_ta: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        created_at: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const totalPage = Math.ceil(hinhAnh.length / pageSize);
    return {
      page,
      pageSize,
      totalPage,
      item: hinhAnh,
    };
  },

  findOne: async function (req) {
    const hinhID = Number(req.params.id);
    const userID = req.user?.nguoi_dung_id;
    if (!hinhID) throw new BadRequestException("Invalid hinh ID");
    const hinhAnh = await prisma.hinh_anh.findUnique({
      where: {
        hinh_id: hinhID,
      },
      include: {
        nguoi_dung: {
          select: {
            nguoi_dung_id: true,
            ho_ten: true,
            email: true,
          },
        },
      },
    });
    const pinned = userID
      ? !!(await prisma.luu_anh.findUnique({
          where: {
            nguoi_dung_id_hinh_id: {
              nguoi_dung_id: userID,
              hinh_id: hinhID,
            },
          },
        }))
      : false;
    const { nguoi_dung, ...imageInfo } = hinhAnh;
    return {
      image: imageInfo,
      nguoi_tao: nguoi_dung,
      pinned,
    };
  },

  pinImage: async function (req) {
    const userID = Number(req.user?.nguoi_dung_id);
    const hinhID = Number(req.params.id);
    if (!hinhID) throw new BadRequestException(`Invalid hinh ID`);
    const hinhAnh = await prisma.hinh_anh.findUnique({
      where: {
        hinh_id: hinhID,
      },
    });
    if (!hinhAnh) throw new BadRequestException(`Image not found`);
    const luuAnh = await prisma.luu_anh.create({
      data: {
        nguoi_dung_id: userID,
        hinh_id: hinhID,
        ngay_luu: new Date(),
      },
    });
    return luuAnh;
  },

  unpinImage: async (req) => {
    const userID = Number(req.user?.nguoi_dung_id);
    const hinhID = Number(req.params.id);
    if (!hinhID) throw new BadRequestException(`Invalid hinh ID`);
    const hinhAnh = await prisma.hinh_anh.findUnique({
      where: {
        hinh_id: hinhID,
      },
    });
    if (!hinhAnh) throw new BadRequestException(`Image not found`);
    await prisma.luu_anh.delete({
      where: {
        nguoi_dung_id_hinh_id: {
          nguoi_dung_id: userID,
          hinh_id: hinhID,
        },
      },
    });
    return;
  },

  createComment: async function (req) {
    const userID = Number(req.user?.nguoi_dung_id);
    const hinhID = Number(req.params.id);
    const comment = req.body.noi_dung;
    if (!comment || !comment.trim()) {
      throw new BadRequestException(`Content is required`);
    }
    if (!hinhID) {
      throw new BadRequestException(`Invalid hinh ID`);
    }
    const image = await prisma.hinh_anh.findUnique({
      where: {
        hinh_id: hinhID,
      },
    });
    if (!image) throw new BadRequestException(`Image not found`);
    const binhLuan = await prisma.binh_luan.create({
      data: {
        nguoi_dung_id: userID,
        hinh_id: hinhID,
        noi_dung: comment,
      },
    });
    return {
      id: binhLuan.binh_luan_id,
      content: binhLuan.noi_dung,
      created_at: binhLuan.created_at,
    };
  },

  getComment: async function (req) {
    const hinhID = Number(req.params.id);
    if (!hinhID) throw new BadRequestException(`Invalid hinh ID`);
    const binhLuan = await prisma.binh_luan.findMany({
      where: {
        hinh_id: hinhID,
      },
    });
    return binhLuan;
  },

  remove: async function (req) {
    const hinhID = Number(req.params.id);
    if (!hinhID) throw new BadRequestException(`Invalid hinh ID`);
    const hinhAnh = await prisma.hinh_anh.findUnique({
      where: {
        hinh_id: hinhID,
      },
    });
    if (!hinhAnh) throw new BadRequestException(`Image not found`);
    const hinhAnhPath = path.resolve(process.cwd(), hinhAnh.duong_dan);
    try {
      await fs.promises.unlink(hinhAnhPath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw new BadRequestException("Failed to delete image file");
      }
    }
    await prisma.$transaction([
      prisma.binh_luan.deleteMany({ where: { hinh_id: hinhID } }),
      prisma.luu_anh.deleteMany({ where: { hinh_id: hinhID } }),
      prisma.hinh_anh.delete({ where: { hinh_id: hinhID } }),
    ]);
    return;
  },
};
