import { responseSuccess } from "../common/utils/response.util.mjs";
import { userService } from "../services/user.service.mjs";

export const userController = {
  getInfo: async function (req, res, next) {
    try {
      const result = await userService.getInfo(req);
      responseSuccess(res, result, `Get user info successful`);
    } catch (err) {
      next(err);
    }
  },

  uploadImage: async (req, res, next) => {
    try {
      const result = await userService.uploadImage(req);
      responseSuccess(res, result, `Upload image successful`);
    } catch (err) {
      next(err);
    }
  },
  uploadAvatar: async (req, res, next) => {
    try {
      const result = await userService.uploadAvatar(req);
      responseSuccess(res, result, `Upload avatar successful`);
    } catch (err) {
      next(err);
    }
  },
  getPinnedImages: async (req, res, next) => {
    try {
      const result = await userService.getPinnedImages(req);
      responseSuccess(res, result, `Get pinned images successful`);
    } catch (err) {
      next(err);
    }
  },
  getCreatedImages: async (req, res, next) => {
    try {
      const result = await userService.getCreatedImages(req);
      responseSuccess(res, result, `Get created images successful`);
    } catch (err) {
      next(err);
    }
  },
  editInfo: async (req, res, next) => {
    try {
      const result = await userService.editInfo(req);
      responseSuccess(res, result, `Edit user info successful`);
    } catch (err) {
      next(err);
    }
  },
};
