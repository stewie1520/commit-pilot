import {z} from 'npm:genkit';
import {getAI} from '../ai-instance.ts';

const ImproveCommitMessageInputSchema = z.object({
  commitMessage: z.string().describe('The commit message to improve.'),
  diff: z.string().describe('The diff of the changes.'),
  commitLint: z.string().optional().describe('The commit lint config.'),
});
export type ImproveCommitMessageInput = z.infer<typeof ImproveCommitMessageInputSchema>;

const ImproveCommitMessageOutputSchema = z.object({
  improvedCommitMessage: z.string().describe('The improved commit message.'),
});
export type ImproveCommitMessageOutput = z.infer<typeof ImproveCommitMessageOutputSchema>;

export function improveCommitMessage(
  input: ImproveCommitMessageInput
): Promise<ImproveCommitMessageOutput> {
  return improveCommitMessageFlow(input);
}

const prompt = (await getAI()).definePrompt({
  name: 'improveCommitMessagePrompt',
  input: {
    schema: z.object({
      commitMessage: z.string().describe('The commit message to improve.'),
      diff: z.string().describe('The diff of the changes.'),
    }),
  },
  output: {
    schema: z.object({
      improvedCommitMessage: z.string().describe('The improved commit message.'),
    }),
  },
  prompt: `You are an AI that improves commit messages based on the diff of the changes.\n\n  Here is the commit message to improve: {{{commitMessage}}}\n  Here is the diff of the changes: {{{diff}}}\n\n  If there is a commit lint config, please follow it.

  Commit lint config:
  {{commitLint}}

  Please provide an improved commit message that is clearer, more concise, and more informative.\n  The improved commit message should accurately reflect the changes made in the diff.\n  Do not include any explanation or commentary, only the improved commit message.  Make it concise, under 70 characters.\n  `,
});

const improveCommitMessageFlow = (await getAI()).defineFlow<
  typeof ImproveCommitMessageInputSchema,
  typeof ImproveCommitMessageOutputSchema
>({
  name: 'improveCommitMessageFlow',
  inputSchema: ImproveCommitMessageInputSchema,
  outputSchema: ImproveCommitMessageOutputSchema,
},
async (input: ImproveCommitMessageInput) => {
  const {output} = await prompt(input);

  if (!output) {
    throw new Error('Failed to improve commit message');
  }

  return {
    improvedCommitMessage: output.improvedCommitMessage
  };
});
