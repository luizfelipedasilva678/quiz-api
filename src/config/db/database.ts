import { base64, Client } from "../../../deps/deps.ts";

class Database {
  private static client: Client | null = null;

  private constructor() {}

  static getClient() {
    if (Database.client === null) {
      Database.client = new Client({
        hostname: Deno.env.get("DB_HOST"),
        port: Deno.env.get("DB_PORT"),
        user: Deno.env.get("DB_USER"),
        password: Deno.env.get("DB_PASSWORD"),
        database: Deno.env.get("DB_NAME"),
        tls: {
          enforce: true,
          enabled: true,
          caCertificates: [
            new TextDecoder().decode(
              base64.decodeBase64(Deno.env.get("DB_SSL_CERT")!),
            ),
          ],
        },
      });
    }

    return Database.client;
  }
}

export default Database;
