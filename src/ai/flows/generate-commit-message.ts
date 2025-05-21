import { z } from "npm:genkit";
import { getAI } from "../ai-instance.ts";

const GenerateCommitMessageInputSchema = z.object({
  diff: z.string().describe('The diff of the staged changes.'),
  commitLint: z.string().optional().describe('The commit lint config.'),
});

export type GenerateCommitMessageInput = z.infer<typeof GenerateCommitMessageInputSchema>;

const GenerateCommitMessageOutputSchema = z.object({
  commitMessage: z.string().describe('The generated commit message.'),
});

export type GenerateCommitMessageOutput = z.infer<typeof GenerateCommitMessageOutputSchema>;

export function generateCommitMessage(input: GenerateCommitMessageInput): Promise<GenerateCommitMessageOutput> {
  return generateCommitMessageFlow(input);
}

const generateCommitMessageFlow = (await getAI()).defineFlow<
  typeof GenerateCommitMessageInputSchema,
  typeof GenerateCommitMessageOutputSchema
>({
  name: 'generateCommitMessageFlow',
  inputSchema: GenerateCommitMessageInputSchema,
  outputSchema: GenerateCommitMessageOutputSchema,
}, async (input: GenerateCommitMessageInput) => {
  const { output } = await generateCommitMessagePrompt(input)
  if (!output) {
    throw new Error('Failed to generate commit message')
  }

  return output
})

const generateCommitMessagePrompt = (await getAI()).definePrompt({
  name: 'generateCommitMessagePrompt',
  input: {
    schema: GenerateCommitMessageInputSchema,
  },
  output: {
    schema: GenerateCommitMessageOutputSchema,
  },
  prompt: `  
  You are an expert in crafting commit messages. Analyze the following diff of staged changes and generate a concise and informative commit message.

  If there is a commit lint config, please follow it.

  Commit lint config:
  {{commitLint}}

  Diff:
  {{diff}}

  Commit Message:`,
})
