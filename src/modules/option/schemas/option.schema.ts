import { z } from "../../../../deps/deps.ts";

const optionSchema = z.object({
  description: z.string({
    required_error: "description is required",
  }),
  is_correct: z.boolean({
    required_error: "is_correct is required",
  }),
});

export default optionSchema;
