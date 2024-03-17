import setEnvs from "./config/env/setEnvs.ts";
import Database from "./config/db/database.ts";
import OptionRepository from "./repositories/option-rdb.repository.ts";
import QuestionRepository from "./repositories/question-rdb.repository.ts";
import QuizRepository from "./repositories/quiz-rdb.repository.ts";

async function start() {
  if (Deno.env.get("ENV") === "development") {
    await setEnvs();
  }

  const client = Database.getClient();
  await client.connect();
  const optionRepository = new OptionRepository(client);
  const questionRepository = new QuestionRepository(client);
  const quizRepository = new QuizRepository(client);
  console.log(optionRepository, questionRepository);

  console.log(
    await quizRepository.getById(1),
  );

  console.log("Connected to the database? ", client.connected);
}

start();
