import express from "express";
import {
  optionalProtect,
  protect,
} from "../common/middlewares/protect.middleware.mjs";
import { hinhAnhController } from "../controllers/hinh-anh.controller.mjs";
const hinhAnhRouter = express.Router();

hinhAnhRouter.get("/", hinhAnhController.findAll);
hinhAnhRouter.get("/:id", optionalProtect, hinhAnhController.findOne);
hinhAnhRouter.post("/:id/pin", protect, hinhAnhController.pinImage);
hinhAnhRouter.delete("/:id/unpin", protect, hinhAnhController.unpinImage);
hinhAnhRouter.get("/:id/comment", hinhAnhController.getComment);
hinhAnhRouter.post("/:id/comment", protect, hinhAnhController.createComment);
hinhAnhRouter.delete("/:id", protect, hinhAnhController.remove);
export default hinhAnhRouter;
