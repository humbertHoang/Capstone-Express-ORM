import express from "express";
import { errorHandler } from "./src/common/middlewares/error.middleware.mjs";
import rootRouter from "./src/routers/root.router.mjs";
const app = express();
app.use(express.json());
app.use(express.static("."));
app.use(rootRouter);
app.use(errorHandler);
app.listen(3069, () => {
  console.log(`Server Online At Port 3069`);
});
