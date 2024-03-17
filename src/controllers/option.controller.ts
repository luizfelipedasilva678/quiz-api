import OptionService from "../services/option.service.ts";
import { PartialOption } from "../types/option.types.ts";

export default class OptionController {
  private service: OptionService;

  constructor(service: OptionService) {
    this.service = service;
  }

  create(data: PartialOption) {
    return this.service.createOption(data);
  }
}
