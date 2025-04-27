const auth = {
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register",
      responses: {
        200: {
          description: "User registered successfully",
        },
      },
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                mat_khau: { type: "string" },
                ho_ten: { type: "string" },
                tuoi: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login",
      responses: {
        200: {
          description: "User logged in successfully",
        },
      },
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                mat_khau: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "User logged out successfully",
        },
      },
    },
  },
  "/auth/refresh-token": {
    post: {
      tags: ["Auth"],
      summary: "Refresh token",
      responses: {
        200: {
          description: "Token refreshed successfully",
        },
      },
    },
  },
};
export default auth;
