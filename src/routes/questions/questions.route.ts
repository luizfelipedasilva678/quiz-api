import { Client, Hono, HTTPException, validator } from "../../../deps/deps.ts";
import OptionRDBRepository from "../../repositories/option-rdb.repository.ts";
import OptionService from "../../services/option.service.ts";
import OptionController from "../../controllers/option.controller.ts";
import mountErrorMessage from "../../utils/validation/mount-error-message.ts";
import validateParam from "../../utils/validation/validate-param.ts";
import optionSchema from "../../schemas/option.schema.ts";

function questionRoute(client: Client) {
  const optionRepository = new OptionRDBRepository(client);
  const optionService = new OptionService(optionRepository);
  const optionController = new OptionController(optionService);

  const question = new Hono();

  question.post(
    "/:questionId/options",
    validator("json", (option) => {
      const parsed = optionSchema.safeParse(option);

      if (!parsed.success) {
        const message = mountErrorMessage(parsed.error.errors);
        throw new HTTPException(400, { message });
      }

      return parsed.data;
    }),
    validator("param", (param) => {
      if (!validateParam(param.questionId)) {
        throw new HTTPException(400, { message: "Invalid questio id" });
      }

      return {
        questionId: Number(param.questionId),
      };
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
  );

  return question;
}

export default questionRoute;
