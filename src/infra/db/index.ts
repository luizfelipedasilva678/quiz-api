import { Client } from "../../../deps/index.ts";

const connString = Deno.env.get("CONN_STRING");
const client = new Client(connString);

export default client;
