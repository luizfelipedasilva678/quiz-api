import { Client } from "../../../../deps/deps.ts";
import ImageHandlerFactory from "../../common/image/factories/image-handler.factory.ts";
import QuestionController from "../controllers/question.controller.ts";
import QuestionService from "../services/question.service.ts";
import QuestionRepositoryFactory from "./question-repository.factory.ts";

export default class QuestionControllerFactory {
  static makeController(client: Client): QuestionController {
    const repository = QuestionRepositoryFactory.makeRepository(client);
    const service = new QuestionService(repository);
    const imageHandler = ImageHandlerFactory.makeImageHandler();
    return new QuestionController(service, imageHandler);
  }
}
