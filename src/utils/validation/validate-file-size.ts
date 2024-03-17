export default function validateFileSize(file: File) {
  const twoMB = 1024 * 1024 * 2;

  return file.size > twoMB;
}
