import { execSync } from "node:child_process";

/**
 * @description git add .
 */
export const gitAdd = async () => {
  await execSync('git add .') 
}