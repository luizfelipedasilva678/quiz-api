import { createRoute, z } from "npm:@hono/zod-openapi@latest";

const createQuiz = createRoute({
  method: "post",
  path: "/v1/quizzes",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z
            .object({
              name: z.string(),
              subject: z.string(),
              image: z.instanceof(File).nullable().optional(),
            })
            .openapi("Quizzes - FormData for creating a quiz"),
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z
            .object({
              id: z.number(),
              name: z.string(),
              subject: z.string(),
              image_id: z.string().nullable(),
            })
            .openapi("Quizzes - Response after creating a quiz"),
        },
      },
      description: "Quizzes - Created quiz",
    },
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Quizzes - Create quiz Bad request (missing fields)"),
        },
      },
      description: "Quizzes - Create quiz Bad request (missing fields)",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Quizzes - Server error"),
        },
      },
      description: "Quizzes - Server error",
    },
  },
});

const getAllQuizzes = createRoute({
  method: "get",
  path: "/v1/quizzes",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.array(z.object({
            id: z.number(),
            name: z.string(),
            subject: z.string(),
            image_id: z.string().nullable(),
          })).openapi("Quizzes - All quizzes"),
        },
      },
      description: "Quizzes - All quizzes",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Quizzes - Server error getting all quizzes"),
        },
      },
      description: "Quizzes - Server error getting all quizzes",
    },
  },
});

const createQuizQuestion = createRoute({
  method: "post",
  path: "/v1/quizzes/{quizId}/questions",
  request: {
    params: z.object({
      quizId: z
        .string()
        .openapi({
          param: {
            name: "quizId",
            in: "path",
          },
        }),
    }),
    body: {
      content: {
        "multipart/form-data": {
          schema: z
            .object({
              title: z.string(),
              image: z.instanceof(File).nullable().optional(),
            })
            .openapi("Quizzes - FormData for creating a question"),
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
          }).openapi("Quizzes - Get quiz questions Bad request (invalid id)"),
        },
      },
      description: "Quizzes - Get quiz question Bad request (invalid id)",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Quizzes - Server error creating question"),
        },
      },
      description: "Quizzes - Server error creating question",
    },
    200: {
      content: {
        "application/json": {
          schema: z.object({
            id: z.number(),
            quiz_id: z.number(),
            title: z.string(),
            image_id: z.string().nullable(),
          }).openapi("Quizzes - Created question"),
        },
      },
      description: "Quizzes - Created question",
    },
  },
});

const getQuiz = createRoute({
  method: "get",
  path: "/v1/quizzes/{quizId}",
  request: {
    params: z.object({
      quizId: z
        .string()
        .openapi({
          param: {
            name: "quizId",
            in: "path",
          },
        }),
    }),
  },
  responses: {
    400: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Quizzes - Get quiz Bad request (invalid id)"),
        },
      },
      description: "Quizzes - Get quiz Bad request (invalid id)",
    },
    404: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Quizzes - Quiz not found"),
        },
      },
      description: "Quizzes - Quiz not found",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }).openapi("Quizzes - Server error finding quiz"),
        },
      },
      description: "Quizzes - Server error finding quiz",
    },
    200: {
      content: {
        "application/json": {
          schema: z.array(z.object({
            id: z.number(),
            name: z.string(),
            subject: z.string(),
            image_id: z.string().nullable(),
            question: z.array(z.object({
              id: z.number(),
              title: z.string(),
              image_id: z.string().nullable(),
              options: z.array(z.object({
                id: z.number(),
                description: z.string(),
                is_correct: z.boolean(),
              })),
            })),
          })).openapi("Quizzes - Found quizzes"),
        },
      },
      description: "Quizzes - Found quizzes",
    },
  },
});

export { createQuiz, createQuizQuestion, getAllQuizzes, getQuiz };
