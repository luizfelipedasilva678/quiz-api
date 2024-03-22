import { Client } from "../../../../deps/deps.ts";
import { OptionRepositoryProtocol } from "../types/option.types.ts";
import OptionRDBRepository from "../repositories/option-rdb.repository.ts";

export default class OptionRepositoryFactory {
  static makeRepository(client: Client): OptionRepositoryProtocol {
    return new OptionRDBRepository(client);
  }
}
