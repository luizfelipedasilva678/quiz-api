import { z } from "../../../deps/deps.ts";
import validateFileSize from "../../utils/validation/validate-file-size.ts";

const schema = z.object({
  name: z.string({
    required_error: "name is required",
  }),
  subject: z.string({
    required_error: "subject is required",
  }),
  image: z.instanceof(File, { message: "image is not a file" }).refine(
    (f) => validateFileSize(f),
    {
      message: "image size must be less than 2MB",
    },
  ).optional(),
});

export default schema;
