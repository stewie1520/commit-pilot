import { execSync } from "node:child_process";

/**
 * @description git checkout -b
 */
export const gitCreateNewBranch = async (branchName: string) => {
  await execSync(`git checkout -b ${branchName}`)
}
