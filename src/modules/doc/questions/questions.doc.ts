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
            .openapi("Questions - Body for creating a option"),
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
          }).openapi("Questions - Invalid question Id"),
        },
      },
      description: "Questions - Invalid question ID",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Questions - Error creating option"),
        },
      },
      description: "Questions - Error creating option",
    },
    200: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.number(),
            question_id: z.number(),
            description: z.string(),
            is_correct: z.boolean(),
          }).openapi("Questions - Created question"),
        },
      },
      description: "Questions - Created question",
    },
  },
});

export { createQuestionOption };
