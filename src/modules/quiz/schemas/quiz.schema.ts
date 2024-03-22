import { z } from "../../../../deps/deps.ts";
import fileIsValid from "../../common/helpers/validation/file-is-valid.ts";

const quizSchema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  subject: z.string({
    required_error: "subject is required",
  }),
  image: z.instanceof(File, { message: "image is not a file" }).refine(
    (f) => fileIsValid(f),
    {
      message: "File is not valid",
    },
  ).optional(),
});

export default quizSchema;
