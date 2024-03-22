import { Hono, HTTPException, validator } from "../../../../deps/deps.ts";
import OptionController from "../../option/controllers/option.controller.ts";
import mountErrorMessage from "../../common/helpers/validation/mount-error-message.ts";
import validateParam from "../../common/helpers/validation/validate-param.ts";
import optionSchema from "../../option/schemas/option.schema.ts";
import { Router } from "../../common/types/router.types.ts";
import {
  HTTP_BAD_REQUEST,
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_METHOD_NOT_ALLOWED_MESSAGE,
} from "../../common/helpers/constants.ts";

class QuestionRouter implements Router<Hono> {
  constructor(private optionController: OptionController) {}

  getRouter() {
    const question = new Hono();

    question.post(
      "/:questionId/options",
      validator("param", (param) => {
        if (!validateParam(param.questionId)) {
          throw new HTTPException(HTTP_BAD_REQUEST, {
            message: "Invalid question id",
          });
        }

        return {
          questionId: Number(param.questionId),
        };
      }),
      validator("json", (option) => {
        const parsed = optionSchema.safeParse(option);

        if (!parsed.success) {
          const message = mountErrorMessage(parsed.error.errors);
          throw new HTTPException(HTTP_BAD_REQUEST, { message });
        }

        return parsed.data;
      }),
      async (c) => {
        const { questionId } = c.req.valid("param");
        const body = c.req.valid("json");

        const option = await this.optionController.create({
          description: body.description,
          is_correct: body.is_correct,
          question_id: questionId,
        });

        return c.json(option);
      },
    ).all(() => {
      throw new HTTPException(HTTP_METHOD_NOT_ALLOWED, {
        message: HTTP_METHOD_NOT_ALLOWED_MESSAGE,
      });
    });

    return question;
  }
}

export default QuestionRouter;
