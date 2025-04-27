import express from "express";
import { protect } from "../common/middlewares/protect.middleware.mjs";
import { authController } from "../controllers/auth.controller.mjs";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", protect, authController.logout);
authRouter.post("/refresh-token", authController.refreshToken);
export default authRouter;
