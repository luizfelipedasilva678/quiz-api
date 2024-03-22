import { Client } from "../../../../deps/deps.ts";
import OptionController from "../controllers/option.controller.ts";
import OptionService from "../services/option.service.ts";
import OptionRepositoryFactory from "./option-repository.factory.ts";

export default class OptionControllerFactory {
  static makeController(client: Client): OptionController {
    const repository = OptionRepositoryFactory.makeRepository(client);
    const service = new OptionService(repository);
    return new OptionController(service);
  }
}
