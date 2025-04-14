import { execSync } from "node:child_process";

/**
 * @description git branch --show-current
 */
export const gitGetCurrentBranch = async () => {
  return (await execSync('git branch --show-current')).toString('utf-8').trim()
}