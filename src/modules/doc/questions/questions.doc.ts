import { createRoute, z } from "npm:@hono/zod-openapi@latest";

const createQuestionOption = createRoute({
  method: "post",
  path: "/v1/questions/{questionId}/options",
  request: {
    params: z.object({
      questionId: z
        .string()
        .openapi({
          param: {
            name: "questionId",
            in: "path",
          },
        }),
    }),
    body: {
      content: {
        "application/json": {
          schema: z
            .object({
              description: z.string(),
              is_correct: z.boolean(),
            })
            .openapi("Body for creating a option"),
        },
      },
    },
  },
  responses: {
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Invalid question Id"),
        },
      },
      description: "Invalid question ID",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Error creating option"),
        },
      },
      description: "Error creating option",
    },
    200: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.number(),
            question_id: z.number(),
            description: z.string(),
            is_correct: z.boolean(),
          }).openapi("Created question"),
        },
      },
      description: "Created question",
    },
  },
});

export { createQuestionOption };
