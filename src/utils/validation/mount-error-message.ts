import { ZodIssue } from "../../../deps/deps.ts";

export default function mountErrorMessage(errors: ZodIssue[]): string {
  const messages = errors.map((error) => error.message);
  return messages.join(", ");
}
