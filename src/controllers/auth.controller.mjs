import { responseSuccess } from "../common/utils/response.util.mjs";
import { authService } from "../services/auth.service.mjs";

export const authController = {
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req);
      responseSuccess(res, result, `Register successful`);
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authService.login(req, res);
      responseSuccess(res, result.user, `Login successful`, undefined, {
        tokenExpiry: result.tokenMeta,
        authMethod: "credentials",
      });
    } catch (err) {
      next(err);
    }
  },
  logout: async (req, res, next) => {
    try {
      await authService.logout(req, res);
      responseSuccess(res, undefined, `Logout successful`);
    } catch (err) {
      next(err);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const result = await authService.refreshToken(req, res);
      responseSuccess(
        res,
        undefined,
        `Refresh token successful`,
        undefined,
        result,
      );
    } catch (err) {
      next(err);
    }
  },
};
