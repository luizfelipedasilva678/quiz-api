export default function fileIsValid(file: File) {
  const twoMB = 1024 * 1024 * 2;

  if (
    file.type !== "image/png" && file.type !== "image/jpeg" && file.size > twoMB
  ) {
    return false;
  }

  return true;
}
