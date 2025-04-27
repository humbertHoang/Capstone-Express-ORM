import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../common/swagger/init.swagger.mjs";
import authRouter from "./auth.router.mjs";
import hinhAnhRouter from "./hinh-anh.router.mjs";
import userRouter from "./user.router.mjs";

const rootRouter = express.Router();
rootRouter.use("/api-docs", swaggerUi.serve);
rootRouter.get("/api-docs", (req, res) => {
  const url = `${req.protocol}://${req.get("host")}`;
  const isMatchUrl = swaggerDocument.servers.find((server) => {
    return server.url === url;
  });
  if (!isMatchUrl) {
    swaggerDocument.servers.unshift({
      url,
      description: "Current server",
    });
  }
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })(req, res);
});
rootRouter.get("/", async (req, res, next) => {
  res.json({ message: `OK` });
});

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/hinh-anh", hinhAnhRouter);
export default rootRouter;
