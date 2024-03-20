import { Client } from "../../../deps/deps.ts";
import ImageHandlerFactory from "../image-handler/image-handler.factory.ts";
import QuizController from "../../controllers/quiz.controller.ts";
import QuizService from "../../services/quiz.service.ts";
import QuizRepositoryFactory from "./quiz-repository.factory.ts";

export default class QuizControllerFactory {
  static makeController(client: Client): QuizController {
    const repository = QuizRepositoryFactory.makeRepository(client);
    const service = new QuizService(repository);
    const imageHandler = ImageHandlerFactory.makeImageHandler();
    return new QuizController(service, imageHandler);
  }
}
