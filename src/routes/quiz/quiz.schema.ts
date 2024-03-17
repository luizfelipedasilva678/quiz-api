import { z } from "../../../deps/deps.ts";
import validateFileSize from "../../utils/validation/validate-file-size.ts";

const schema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  subject: z.string({
    required_error: "Subject is required",
  }),
  image: z.instanceof(File).refine((f) => validateFileSize(f), {
    message: "Image size must be less than 2MB",
  }).optional(),
});

export default schema;
