export interface Quiz {
  id: number;
  name: string;
  subject: string;
  image_id?: string;
}

export type PartialQuiz = Omit<Quiz, "id">;
export type QuizWithQuestionsAndOptions = Quiz;

export interface QuizRepositoryProtocol {
  create: (partialQuiz: PartialQuiz) => Promise<Quiz>;
  delete: (id: number) => Promise<Quiz>;
  getById: (id: number) => Promise<Quiz>;
  getAll: () => Promise<Quiz[]>;
}

export class QuizRepositoryException extends Error {}
