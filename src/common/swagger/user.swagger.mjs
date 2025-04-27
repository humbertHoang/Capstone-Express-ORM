const user = {
  "/user/get-info": {
    get: {
      tags: ["User"],
      summary: "Get user info",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "User info retrieved successfully",
        },
      },
    },
  },
  "/user/get-pinned": {
    get: {
      tags: ["User"],
      summary: "Get pinned images",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Pinned images retrieved successfully",
        },
      },
    },
  },
  "/user/get-created": {
    get: {
      tags: ["User"],
      summary: "Get created images",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Created images retrieved successfully",
        },
      },
    },
  },
  "/user/edit": {
    patch: {
      tags: ["User"],
      summary: "Edit user info",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "User info edited successfully",
        },
      },
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                ho_ten: { type: "string" },
                email: { type: "string" },
                tuoi: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
  "/user/upload": {
    post: {
      tags: ["User"],
      summary: "Upload image",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Image uploaded successfully",
        },
      },
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                image: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
  },
  "/user/upload-avatar": {
    post: {
      tags: ["User"],
      summary: "Upload avatar",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Avatar uploaded successfully",
        },
      },
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                avatar: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
  },
};
export default user;
