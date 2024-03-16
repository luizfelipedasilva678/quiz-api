import setEnvs from "./infra/env/setEnvs.ts";

async function getClient() {
  const client = (await import("./infra/db/index.ts")).default;
  return client;
}

async function start() {
  await setEnvs();
  const client = await getClient();
  await client.connect();
}

try {
  await start();
} catch {
  const client = await getClient();
  client.end();
}
