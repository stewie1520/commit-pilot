import {z} from 'npm:genkit';
import {getAI} from '../ai-instance.ts';

const GenerateBranchNameInputSchema = z.object({
  diff: z.string().describe('The diff of the changes.'),
});
export type GenerateBranchNameInput = z.infer<typeof GenerateBranchNameInputSchema>;

const GenerateBranchNameOutputSchema = z.object({
  branchName: z.string().describe('The branch name.'),
});
export type GenerateBranchNameOutput = z.infer<typeof GenerateBranchNameOutputSchema>;

export async function generateBranchName(
  input: GenerateBranchNameInput
): Promise<GenerateBranchNameOutput> {
  return generateBranchNameFlow(input);
}

const prompt = (await getAI()).definePrompt({
  name: 'generateBranchNamePrompt',
  input: {
    schema: z.object({
      diff: z.string().describe('The diff of the changes.'),
    }),
  },
  output: {
    schema: z.object({
      branchName: z.string().describe('The branch name.'),
    }),
  },
  prompt: `You are an AI that generates branch names based on the diff of the changes.\n\n  Here is the diff of the changes: {{{diff}}}\n\n  Please provide a branch name that is clear, concise, and informative.\n  The branch name should accurately reflect the changes made in the diff.\n  Do not include any explanation or commentary, only the branch name.  Make it concise, under 70 characters.\n  `,
});

const generateBranchNameFlow = (await getAI()).defineFlow<
  typeof GenerateBranchNameInputSchema,
  typeof GenerateBranchNameOutputSchema
>({
  name: 'generateBranchNameFlow',
  inputSchema: GenerateBranchNameInputSchema,
  outputSchema: GenerateBranchNameOutputSchema,
},
async input => {
  const {output} = await prompt(input);

  if (!output) {
    throw new Error('Failed to generate branch name');
  }

  return {
    branchName: output.branchName
  };
});
