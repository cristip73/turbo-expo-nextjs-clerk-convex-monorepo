import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "../convex/_generated/api";
import { Auth } from "convex/server";

export const getUserId = async (ctx: { auth: Auth }) => {
  return (await ctx.auth.getUserIdentity())?.subject;
};

// Get all notes for a specific user
export const getNotes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const notes = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return notes;
  },
});

// Get note for a specific note
export const getNote = query({
  args: {
    id: v.optional(v.id("notes")),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    if (!id) return null;
    const note = await ctx.db.get(id);
    return note;
  },
});

// Create a new note for a user
export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    isSummary: v.boolean(),
  },
  handler: async (ctx, { title, content, isSummary }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("User not found");
    const noteId = await ctx.db.insert("notes", { userId, title, content });

    if (isSummary) {
      await ctx.scheduler.runAfter(0, internal.openai.summary, {
        id: noteId,
        title,
        content,
      });
    }

    return noteId;
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.noteId);
  },
});

// Add updateNote mutation to edit notes
export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, title, content } = args;
    const userId = await getUserId(ctx);
    
    // Verificăm dacă nota există
    const existingNote = await ctx.db.get(id);
    if (!existingNote) {
      throw new Error("Note not found");
    }
    
    // Verificăm dacă utilizatorul are permisiunea să editeze nota
    if (existingNote.userId !== userId) {
      throw new Error("Unauthorized to edit this note");
    }
    
    // Actualizăm nota
    await ctx.db.patch(id, { title, content });
    
    // Actualizăm și summary-ul dacă e necesar
    if (existingNote.summary) {
      await ctx.scheduler.runAfter(0, internal.openai.summary, {
        id,
        title,
        content,
      });
    }
    
    return id;
  },
});
