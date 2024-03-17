import { Client } from "../../../deps/deps.ts";

class Database {
  private static client: Client | null = null;

  private constructor() {}

  static getClient() {
    if (Database.client === null) {
      Database.client = new Client(Deno.env.get("CONN_STRING"));
    }

    return Database.client;
  }
}

export default Database;
