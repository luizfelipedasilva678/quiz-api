import { load } from "../../../deps/index.ts";

export default async function setEnvs() {
  const env = await load();

  for (const [key, value] of Object.entries(env)) {
    Deno.env.set(key, value);
  }
}
