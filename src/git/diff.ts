
import { execSync } from 'node:child_process';

/**
 * @description git diff --staged
 */
export const gitDiff = async (staged: boolean = true) => {
  const cmd = staged ? 'git diff --staged' : 'git diff'

  return (await execSync(cmd)).toString('utf-8')
}
