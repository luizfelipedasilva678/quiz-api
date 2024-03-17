export interface QuestionRepositoryProtocol {
  createOption(partialOption: PartialOption): Promise<Option>;
}

export class QuestionRepositoryException extends Error {}
export class QuestionServiceException extends Error {}

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
