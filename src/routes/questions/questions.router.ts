import { Client, Hono, HTTPException, validator } from "../../../deps/deps.ts";
import QuestionRDBRepository from "../../repositories/question-rdb.repository.ts";
import QuestionController from "./questions.controller.ts";
import QuestionService from "../../services/question.service.ts";
import mountErrorMessage from "../../utils/validation/mount-error-message.ts";
import validateParam from "../../utils/validation/validate-param.ts";
import { optionSchema } from "./questions.schema.ts";

function questionRouter(client: Client) {
  const repository = new QuestionRDBRepository(client);
  const service = new QuestionService(repository);
  const controller = new QuestionController(service);

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

      const option = await controller.createOption({
        description: body.description,
        is_correct: body.is_correct,
        question_id: questionId,
      });

      return c.json(option);
    },
  );

  return question;
}

export default questionRouter;
