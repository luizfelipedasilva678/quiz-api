import { load } from "../../../deps/deps.ts";

export default async function setEnvs() {
  const env = await load();

  for (const [key, value] of Object.entries(env)) {
    Deno.env.set(key, value);
  }
}
