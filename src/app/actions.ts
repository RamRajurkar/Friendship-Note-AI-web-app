
'use server';

import { z } from 'zod';
import { generateFriendshipNote } from '@/ai/flows/generate-friendship-note';
import { customizeFriendshipNote } from '@/ai/flows/customize-friendship-note';

const generateNoteSchema = z.object({
  sharedMemory: z.string().min(10, 'Please share a more detailed memory.'),
  recipientName: z.string().min(1, "Please enter your friend's name."),
  userName: z.string().min(1, 'Please enter your name.'),
  includeInsideJoke: z.boolean(),
});

export async function generateNoteAction(values: z.infer<typeof generateNoteSchema>) {
  const validatedFields = generateNoteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await generateFriendshipNote(validatedFields.data);
    return { success: true, note: result.note };
  } catch (e) {
    return { error: 'Failed to generate note. Please try again.' };
  }
}

const customizeNoteSchema = z.object({
  initialNote: z.string(),
  personalTouches: z.string().min(5, 'Please add a bit more detail for customization.'),
});

export async function customizeNoteAction(values: z.infer<typeof customizeNoteSchema>) {
  const validatedFields = customizeNoteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }
  
  try {
    const result = await customizeFriendshipNote(validatedFields.data);
    return { success: true, note: result.customizedNote };
  } catch(e) {
    return { error: 'Failed to customize note. Please try again.' };
  }
}
