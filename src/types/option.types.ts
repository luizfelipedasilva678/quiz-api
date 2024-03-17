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

export interface OptionRepositoryProtocol {
  create: (partialOption: PartialOption) => Promise<Option>;
}

export class OptionRepositoryException extends Error {
}
