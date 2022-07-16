export const shortenStr = (str: string, charCount: number) => {
  if (str.length <= charCount) return;

  return str.slice(0, charCount / 2) + " ... " + str.slice((-1 * charCount) / 2, str.length - 1);
};
