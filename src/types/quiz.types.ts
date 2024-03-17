export interface Quiz {
  id: number;
  name: string;
  subject: string;
  image_id?: string;
}

export type PartialQuiz = Omit<Quiz, "id">;

export type QuizQueryResult = {
  quiz_id: number;
  quiz_image_id: string;
  quiz_name: string;
  quiz_subject: string;
  question_id: number;
  question_title: string;
  question_image_id: string;
  option_id: number;
  option_descrition: string;
  option_is_correct: boolean;
};
export type QuizFull = {
  id: number;
  name: string;
  subject: string;
  image_id: string;
  questions: {
    id: number;
    title: string;
    image_id: string;
    options: {
      id: number;
      description: string;
      is_correct: boolean;
    }[];
  }[];
};

export interface QuizRepositoryProtocol {
  create: (partialQuiz: PartialQuiz) => Promise<Quiz>;
  delete: (id: number) => Promise<Quiz>;
  getById: (id: number) => Promise<QuizFull | null>;
  getAll: () => Promise<Quiz[]>;
  createOption(partialOption: PartialOption): Promise<Option>;
  createQuestion(partialQuestion: PartialQuestion): Promise<Question>;
}

export class QuizRepositoryException extends Error {}

export interface Option {
  id: number;
  question_id: number;
  description: string;
  is_correct: boolean;
}

export type PartialOption = Omit<
  Option,
  "id" | "created_at" | "updated_at"
>;

export interface Question {
  id: number;
  quiz_id: number;
  title: string;
  image_id?: string;
}

export type PartialQuestion = Omit<
  Question,
  "id" | "created_at" | "updated_at"
>;
