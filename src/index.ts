import { generateBranchName } from "./ai/flows/generate-branch-name.ts";
import { generateCommitMessage } from "./ai/flows/generate-commit-message.ts";
import { improveCommitMessage } from './ai/flows/improve-commit-message.ts';
import { DEFAULT_BRANCHES } from "./const.ts";
import { gitAdd } from "./git/add.ts";
import { gitCommit } from "./git/commit.ts";
import { gitCreateNewBranch } from "./git/create-new-branch.ts";
import { gitDiff } from "./git/diff.ts";
import { gitGetCurrentBranch } from "./git/get-current-branch.ts";

async function main(): Promise<void> {
  const diff = await gitDiff()
  await createBranchIfInDefault(diff)  
  
  console.log('🛠️  Adding changes...');
  await gitAdd()

  console.log('🤖 Generating commit message...');
  let { commitMessage } = await generateCommitMessage({ diff });
  commitMessage = (await improveCommitMessage({ diff, commitMessage })).improvedCommitMessage;

  await gitCommit(commitMessage);
  console.log(`😉 Committing changes with message: "${commitMessage}"`);
}

main().catch(error => {
  console.error(error);
  Deno.exit(1);
})

const createBranchIfInDefault = async (diff: string) => {
  const currentBranch = await gitGetCurrentBranch();
  if (!DEFAULT_BRANCHES.includes(currentBranch)) {
    return;
  }

  console.log('🌳 Default branch detected, switching to another branch...');
  const { branchName } = await generateBranchName({ diff });
  await gitCreateNewBranch(branchName);
}