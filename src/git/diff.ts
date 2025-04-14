
import { execSync } from 'node:child_process';

/**
 * @description git diff --staged
 */
export const gitDiff = async () => {
  return (await execSync('git diff --staged')).toString('utf-8')
}
