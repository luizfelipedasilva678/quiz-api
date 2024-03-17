import {
  OptionRepositoryProtocol,
  OptionServiceException,
  PartialOption,
} from "../types/option.types.ts";

export default class OptionService {
  private repository: OptionRepositoryProtocol;

  constructor(repository: OptionRepositoryProtocol) {
    this.repository = repository;
  }

  async createOption(data: PartialOption) {
    try {
      return await this.repository.create(data);
    } catch (e) {
      throw new OptionServiceException(e.message);
    }
  }
}
