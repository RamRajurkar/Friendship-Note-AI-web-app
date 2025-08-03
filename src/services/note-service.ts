'use server';

/**
 * @fileOverview A simple file-based service for storing and retrieving notes.
 * This is a temporary solution for prototyping.
 *
 * - saveNote - Saves a note and returns a unique ID.
 * - getNote - Retrieves a note by its ID.
 */

import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// Use a temporary file to store notes for this prototype.
const NOTES_FILE_PATH = path.join(os.tmpdir(), 'notes.json');

type NotesData = {
  [key: string]: string;
};

async function readNotes(): Promise<NotesData> {
  try {
    await fs.access(NOTES_FILE_PATH);
    const data = await fs.readFile(NOTES_FILE_PATH, 'utf-8');
    return JSON.parse(data) as NotesData;
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty object.
    return {};
  }
}

async function writeNotes(notes: NotesData): Promise<void> {
  await fs.writeFile(NOTES_FILE_PATH, JSON.stringify(notes, null, 2));
}

/**
 * Saves a note to the file store.
 * @param note The content of the note to save.
 * @returns A unique ID for the saved note.
 */
export async function saveNote(note: string): Promise<string> {
  const notes = await readNotes();
  // Simple random ID generation for prototype purposes.
  const id = Math.random().toString(36).substring(2, 12);
  notes[id] = note;
  await writeNotes(notes);
  return id;
}

/**
 * Retrieves a note from the file store.
 * @param id The unique ID of the note.
 * @returns The note content or null if not found.
 */
export async function getNote(id: string): Promise<string | null> {
  const notes = await readNotes();
  return notes[id] || null;
}
