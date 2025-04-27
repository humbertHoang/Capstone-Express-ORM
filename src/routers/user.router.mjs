import express from "express";
import { protect } from "../common/middlewares/protect.middleware.mjs";
import upload from "../common/multer/local.multer.mjs";
import { userController } from "../controllers/user.controller.mjs";

const userRouter = express.Router();

userRouter.get("/get-info", protect, userController.getInfo);
userRouter.get("/get-pinned", protect, userController.getPinnedImages);
userRouter.get("/get-created", protect, userController.getCreatedImages);
userRouter.patch("/edit", protect, userController.editInfo);
userRouter.post(
  "/upload",
  protect,
  upload.single("image"),
  userController.uploadImage,
);
userRouter.patch(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  userController.uploadAvatar,
);

export default userRouter;
