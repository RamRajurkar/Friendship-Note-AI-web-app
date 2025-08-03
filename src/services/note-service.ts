'use server';

/**
 * @fileOverview A service for storing and retrieving notes using MongoDB.
 *
 * - saveNote - Saves a note and returns a unique ID.
 * - getNote - Retrieves a note by its ID.
 */
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.MONGODB_URI?.split('/').pop()?.split('?')[0] || 'friendship-notes';
const COLLECTION_NAME = 'notes';

async function getNotesCollection() {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    return db.collection(COLLECTION_NAME);
}

/**
 * Saves a note to the database.
 * @param note The content of the note to save.
 * @returns A unique ID for the saved note.
 */
export async function saveNote(note: string): Promise<string> {
  const notesCollection = await getNotesCollection();
  const result = await notesCollection.insertOne({ note, createdAt: new Date() });
  return result.insertedId.toHexString();
}

/**
 * Retrieves a note from the database.
 * @param id The unique ID of the note.
 * @returns The note content or null if not found.
 */
export async function getNote(id: string): Promise<string | null> {
    if (!ObjectId.isValid(id)) {
        return null;
    }
  const notesCollection = await getNotesCollection();
  const noteDocument = await notesCollection.findOne({ _id: new ObjectId(id) });
  
  if (!noteDocument) {
    return null;
  }
  
  return noteDocument.note;
}
