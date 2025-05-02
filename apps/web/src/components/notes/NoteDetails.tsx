"use client";

import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import ComplexToggle from "../home/ComplexToggle";
import { useState } from "react";
import React from "react";

interface NoteDetailsProps {
  noteId: Id<"notes">;
}

const NoteDetails = ({ noteId }: NoteDetailsProps) => {
  const [isSummary, setIsSummary] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const currentNote = useQuery(api.notes.getNote, { id: noteId });
  const updateNote = useMutation(api.notes.updateNote);

  // Inițializează valorile din formular când notița este încărcată
  React.useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  const handleSave = async () => {
    try {
      await updateNote({ id: noteId, title, content });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCancel = () => {
    // Resetează valorile și închide modul de editare
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="container space-y-6 sm:space-y-9 py-20 px-[26px] sm:px-0">
        <h3 className="text-black text-center pb-5 text-xl sm:text-[32px] not-italic font-semibold leading-[90.3%] tracking-[-0.8px]">
          Editează notița
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titlu
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Conținut
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="py-2 px-4 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Anulează
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Salvează
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-6 sm:space-y-9 py-20 px-[26px] sm:px-0">
      <div className="flex justify-between items-center">
        <ComplexToggle isSummary={isSummary} setIsSummary={setIsSummary} />
        <button
          onClick={() => setIsEditing(true)}
          className="py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Editează
        </button>
      </div>
      <h3 className="text-black text-center pb-5 text-xl sm:text-[32px] not-italic font-semibold leading-[90.3%] tracking-[-0.8px]">
        {currentNote?.title}
      </h3>
      <p className="text-black text-xl sm:text-[28px] not-italic font-normal leading-[130.3%] tracking-[-0.7px]">
        {!isSummary
          ? currentNote?.content
          : currentNote?.summary
            ? currentNote?.summary
            : "No Summary available"}
      </p>
    </div>
  );
};

export default NoteDetails;
