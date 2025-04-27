import { responseSuccess } from "../common/utils/response.util.mjs";
import { hinhAnhService } from "../services/hinh-anh.service.mjs";

export const hinhAnhController = {
  findAll: async function (req, res, next) {
    try {
      const result = await hinhAnhService.findAll(req);
      responseSuccess(res, result, `Get all hinh anh successful`);
    } catch (err) {
      next(err);
    }
  },

  findOne: async function (req, res, next) {
    try {
      const result = await hinhAnhService.findOne(req);
      responseSuccess(res, result, `Get hinh anh successful`);
    } catch (err) {
      next(err);
    }
  },

  pinImage: async (req, res, next) => {
    try {
      const result = await hinhAnhService.pinImage(req);
      responseSuccess(res, result, `Pin hinh anh successful`);
    } catch (err) {
      next(err);
    }
  },

  unpinImage: async (req, res, next) => {
    try {
      const result = await hinhAnhService.unpinImage(req);
      responseSuccess(res, result, `Unpin hinh anh successful`);
    } catch (err) {
      next(err);
    }
  },

  createComment: async (req, res, next) => {
    try {
      const result = await hinhAnhService.createComment(req);
      responseSuccess(res, result, `Create comment successful`);
    } catch (err) {
      next(err);
    }
  },

  getComment: async (req, res, next) => {
    try {
      const result = await hinhAnhService.getComment(req);
      responseSuccess(res, result, `Get comment successful`);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await hinhAnhService.remove(req);
      responseSuccess(res, undefined, `Delete hinh anh successful`);
    } catch (err) {
      next(err);
    }
  },
};
