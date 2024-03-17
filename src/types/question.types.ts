export interface QuestionRepositoryProtocol {
  create(partialQuestion: PartialQuestion): Promise<Question>;
}

export class QuestionRepositoryException extends Error {}
export class QuestionServiceException extends Error {}

export type PartialQuestion = Omit<
  Question,
  "id" | "created_at" | "updated_at"
>;

export interface Question {
  id: number;
  quiz_id: number;
  title: string;
  image_id?: string;
}
