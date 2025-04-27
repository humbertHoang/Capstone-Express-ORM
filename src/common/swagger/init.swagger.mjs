import auth from "./auth.swagger.mjs";
import hinhAnh from "./hinh-anh.swagger.mjs";
import user from "./user.swagger.mjs";
const swaggerDocument = {
  openapi: "3.1.1",
  info: {
    title: "API Pinterest Clone",
    version: "1.0.0",
    description: "API for Pinterest Clone",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Example local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: { ...auth, ...user, ...hinhAnh },
};
export default swaggerDocument;
