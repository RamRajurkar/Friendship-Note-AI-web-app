'use server';

/**
 * @fileOverview A friendship note generation AI agent.
 *
 * - generateFriendshipNote - A function that handles the friendship note generation process.
 * - GenerateFriendshipNoteInput - The input type for the generateFriendshipNote function.
 * - GenerateFriendshipNoteOutput - The return type for the generateFriendshipNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFriendshipNoteInputSchema = z.object({
  sharedMemory: z
    .string()
    .describe('A shared memory, occasion, or experience with the recipient (e.g., birthday, Friendship Day).'),
  recipientName: z.string().describe('The name of the recipient.'),
  userName: z.string().describe('Your name.'),
  includeInsideJoke: z.boolean().describe('Whether to include an inside joke.'),
  tone: z.string().describe('The desired tone of the note (e.g., Heartfelt, Funny, Casual).'),
});
export type GenerateFriendshipNoteInput = z.infer<typeof GenerateFriendshipNoteInputSchema>;

const GenerateFriendshipNoteOutputSchema = z.object({
  note: z.string().describe('The generated friendship note.'),
});
export type GenerateFriendshipNoteOutput = z.infer<typeof GenerateFriendshipNoteOutputSchema>;

export async function generateFriendshipNote(
  input: GenerateFriendshipNoteInput
): Promise<GenerateFriendshipNoteOutput> {
  return generateFriendshipNoteFlow(input);
}

const shouldIncludeInsideJoke = ai.defineTool({
  name: 'shouldIncludeInsideJoke',
  description: 'Determines if an inside joke should be included in the friendship note based on user input.',
  inputSchema: z.object({
    includeInsideJoke: z.boolean().describe('Whether to include an inside joke. This comes directly from the user input.'),
  }),
  outputSchema: z.boolean(),
}, async (input) => {
  // Directly return the user's preference.
  return input.includeInsideJoke;
});

const prompt = ai.definePrompt({
  name: 'generateFriendshipNotePrompt',
  input: {schema: GenerateFriendshipNoteInputSchema},
  output: {schema: GenerateFriendshipNoteOutputSchema},
  tools: [shouldIncludeInsideJoke],
  prompt: `You are a friendship note writing assistant. Your goal is to create a heartfelt and memorable note for the user to give to their friend.

  Compose a friendship note based on the following information:
  - Recipient Name: {{{recipientName}}}
  - Your Name: {{{userName}}}
  - Occasion/Memory: {{{sharedMemory}}}
  - Desired Tone: {{{tone}}}

  Instructions:
  1.  The note should be personalized and reflect the shared experience or occasion.
  2.  Adapt the writing style to match the desired tone.
  3.  Include relevant and tasteful emojis to enhance the message.
  4.  If the tool indicates it's appropriate, include a brief, lighthearted inside joke.
  5.  Keep the tone positive and appreciative.
  6.  The note should not exceed 150 words.
  
  Example of inside joke integration:
  
  If shouldIncludeInsideJoke is true:
  "Remember that time when we {{{sharedMemory}}}?  I still laugh about it, especially {{{insideJoke}}}. 😂"
  If shouldIncludeInsideJoke is false:
  "I will always remember when we {{{sharedMemory}}}. ❤️"
`,
});

const generateFriendshipNoteFlow = ai.defineFlow(
  {
    name: 'generateFriendshipNoteFlow',
    inputSchema: GenerateFriendshipNoteInputSchema,
    outputSchema: GenerateFriendshipNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
