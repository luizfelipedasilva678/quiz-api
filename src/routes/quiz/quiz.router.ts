import { Client, Hono, HTTPException } from "../../../deps/deps.ts";
import QuizController from "./quiz.controller.ts";
import QuizService from "../../services/quiz.service.ts";
import QuizRDBRepository from "../../repositories/quiz-rdb.repository.ts";

function quizRouter(client: Client) {
  const repository = new QuizRDBRepository(client);
  const service = new QuizService(repository);
  const controller = new QuizController(service);

  const quiz = new Hono();

  quiz.get("/:id", async (c) => {
    const { id } = c.req.param();
    const quiz = await controller.getById(Number(id));

    if (quiz === null) {
      throw new HTTPException(404, { message: "Quiz not found" });
    }

    return c.json(quiz);
  });

  return quiz;
}

export default quizRouter;
