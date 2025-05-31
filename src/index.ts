import { generateBranchName } from "./ai/flows/generate-branch-name.ts";
import { generateCommitMessage } from "./ai/flows/generate-commit-message.ts";
import { improveCommitMessage } from './ai/flows/improve-commit-message.ts';
import { DEFAULT_BRANCHES } from "./const.ts";
import { gitAdd } from "./git/add.ts";
import { gitCommit } from "./git/commit.ts";
import { gitCreateNewBranch } from "./git/create-new-branch.ts";
import { gitDiff } from "./git/diff.ts";
import { gitGetCurrentBranch } from "./git/get-current-branch.ts";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { checkCommitLint } from './utils/check-commit-lint.ts';

async function main(): Promise<void> {
  const args = parseArgs(Deno.args, {
    alias: {
      'only-staged': 's',
      'help': 'h',
    },
    default: {
      'only-staged': false,
      'help': false,
    }
  });

  if (args['help']) {
    console.log(`
      Usage: cpx [options]
      A tool to generate commit messages and manage branches based on changes.

      Options:
        --only-staged, -s   Only commit staged changes (default: false)
        --help, -h          Show this help message
    `);
    Deno.exit(0);
    return;
  }

  const onlyStaged = args['only-staged'] as boolean;

  if (!onlyStaged) {
    console.log('🛠️  Adding changes...');
    await gitAdd()
  }

  const diffStaged = await gitDiff(true)
  await createBranchIfInDefault(diffStaged)  

  console.log('🤖 Generating commit message...');
  const commitLint = checkCommitLint();
  let { commitMessage } = await generateCommitMessage({ diff: diffStaged, commitLint });
  commitMessage = (await improveCommitMessage({ diff: diffStaged, commitLint, commitMessage })).improvedCommitMessage;

  console.log(`😉 Committing changes with message: "${commitMessage}"`);
  await gitCommit(commitMessage);
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