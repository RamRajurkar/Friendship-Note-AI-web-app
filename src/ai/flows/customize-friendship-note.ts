'use server';

/**
 * @fileOverview A flow for customizing AI-generated friendship notes.
 *
 * - customizeFriendshipNote - A function that handles the customization of friendship notes.
 * - CustomizeFriendshipNoteInput - The input type for the customizeFriendshipNote function.
 * - CustomizeFriendshipNoteOutput - The return type for the customizeFriendshipNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomizeFriendshipNoteInputSchema = z.object({
  initialNote: z.string().describe('The initial AI-generated friendship note.'),
  personalTouches: z
    .string()
    .describe(
      'Any personal touches, memories, or specific details to add to the note.'
    ),
});
export type CustomizeFriendshipNoteInput = z.infer<
  typeof CustomizeFriendshipNoteInputSchema
>;

const CustomizeFriendshipNoteOutputSchema = z.object({
  customizedNote: z
    .string()
    .describe('The final, customized friendship note.'),
});
export type CustomizeFriendshipNoteOutput = z.infer<
  typeof CustomizeFriendshipNoteOutputSchema
>;

export async function customizeFriendshipNote(
  input: CustomizeFriendshipNoteInput
): Promise<CustomizeFriendshipNoteOutput> {
  return customizeFriendshipNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeFriendshipNotePrompt',
  input: {schema: CustomizeFriendshipNoteInputSchema},
  output: {schema: CustomizeFriendshipNoteOutputSchema},
  prompt: `You are an expert at crafting personalized friendship notes.

You will take an initial AI-generated note and add personal touches to it, to ensure the message perfectly reflects the user's feelings and shared experiences.

Initial Note: {{{initialNote}}}

Personal Touches: {{{personalTouches}}}

Customized Note:`, // The customized note should be returned here.
});

const customizeFriendshipNoteFlow = ai.defineFlow(
  {
    name: 'customizeFriendshipNoteFlow',
    inputSchema: CustomizeFriendshipNoteInputSchema,
    outputSchema: CustomizeFriendshipNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
