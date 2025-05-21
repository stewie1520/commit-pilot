export const checkCommitLint = () => {
  const commitLintFiles = ['commitlint.config.js', 'commitlint.config.ts', 'commitlint.config.mjs'];

  for (const file of commitLintFiles) {
    try {
      const fileInfo = Deno.statSync(file)
      if (fileInfo.isFile) {
        const text = Deno.readTextFileSync(file);
        return text;
      }

      return "";
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        continue;
      }
    }

    return "";
  }

  return "";
}
  