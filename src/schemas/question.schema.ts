import { z } from "../../deps/deps.ts";
import fileIsValid from "../utils/validation/file-is-valid.ts";

const questionSchema = z.object({
  title: z.string({
    required_error: "title is required",
  }),
  image: z.instanceof(File, { message: "image is not a file" }).refine(
    (f) => fileIsValid(f),
    {
      message: "File is not valid",
    },
  ).optional(),
});

export default questionSchema;
