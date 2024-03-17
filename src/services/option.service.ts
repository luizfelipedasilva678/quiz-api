import {
  OptionRepositoryProtocol,
  PartialOption,
} from "../types/option.types.ts";

export default class OptionService {
  private repository: OptionRepositoryProtocol;

  constructor(repository: OptionRepositoryProtocol) {
    this.repository = repository;
  }

  create(partialOption: PartialOption) {
    return this.repository.create(partialOption);
  }
}
