'use server';

/**
 * @fileOverview A simple in-memory service for storing and retrieving notes.
 * This is a temporary solution for prototyping and does not persist data.
 *
 * - saveNote - Saves a note and returns a unique ID.
 * - getNote - Retrieves a note by its ID.
 */

const notes = new Map<string, string>();

/**
 * Saves a note to the in-memory store.
 * @param note The content of the note to save.
 * @returns A unique ID for the saved note.
 */
export async function saveNote(note: string): Promise<string> {
  // Simple random ID generation for prototype purposes.
  const id = Math.random().toString(36).substring(2, 12);
  notes.set(id, note);
  return id;
}

/**
 * Retrieves a note from the in-memory store.
 * @param id The unique ID of the note.
 * @returns The note content or null if not found.
 */
export async function getNote(id: string): Promise<string | null> {
  return notes.get(id) || null;
}
