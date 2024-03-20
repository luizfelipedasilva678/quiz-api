import { Hono, HTTPException, validator } from "../../../deps/deps.ts";
import OptionController from "../../controllers/option.controller.ts";
import mountErrorMessage from "../../utils/validation/mount-error-message.ts";
import validateParam from "../../utils/validation/validate-param.ts";
import optionSchema from "../../schemas/option.schema.ts";
import {
  HTTP_BAD_REQUEST,
  HTTP_METHOD_NOT_ALLOWED,
  HTTP_METHOD_NOT_ALLOWED_MESSAGE,
} from "../../helpers/constants.ts";

function questionRoute(optionController: OptionController) {
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

      const option = await optionController.create({
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

export default questionRoute;
