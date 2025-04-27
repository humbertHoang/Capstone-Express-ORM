const hinhAnh = {
  "/hinh-anh": {
    get: {
      tags: ["Hinh Anh"],
      summary: "Get all images",
      responses: {
        200: {
          description: "Images retrieved successfully",
        },
      },
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Page number",
          schema: {
            type: "number",
          },
        },
        {
          name: "pageSize",
          in: "query",
          description: "Page size",
          schema: {
            type: "number",
          },
        },
        {
          name: "search",
          in: "query",
          description: "Search keyword",
          schema: {
            type: "string",
          },
        },
      ],
    },
  },
  "/hinh-anh/{id}": {
    get: {
      tags: ["Hinh Anh"],
      summary: "Get image by ID",
      responses: {
        200: {
          description: "Image by ID retrieved successfully",
        },
      },
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Image ID",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
    },
    delete: {
      tags: ["Hinh Anh"],
      summary: "Delete image by ID",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Image deleted successfully",
        },
      },
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Image ID",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
    },
  },
  "/hinh-anh/{id}/pin": {
    post: {
      tags: ["Hinh Anh"],
      summary: "Pin image",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Image pinned successfully",
        },
      },
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Image ID",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
    },
  },
  "/hinh-anh/{id}/unpin": {
    delete: {
      tags: ["Hinh Anh"],
      summary: "Unpin image",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Image unpinned successfully",
        },
      },
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Image ID",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
    },
  },
  "/hinh-anh/{id}/comment": {
    get: {
      tags: ["Hinh Anh"],
      summary: "Get comments by image ID",
      responses: {
        200: {
          description: "Comments retrieved successfully",
        },
      },
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Image ID",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
    },
    post: {
      tags: ["Hinh Anh"],
      summary: "Create comment",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Comment created successfully",
        },
      },
      parameters: [
        {
          name: "id",
          in: "path",
          description: "Image ID",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                noi_dung: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};
export default hinhAnh;
