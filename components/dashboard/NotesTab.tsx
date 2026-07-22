import React from "react";

interface NotesTabProps {
  noteContent: string;
  updateNote: (content: string) => void;
  isSavingNote: boolean;
  isFetchingNote: boolean;
}

export const NotesTab: React.FC<NotesTabProps> = ({
  noteContent,
  updateNote,
  isSavingNote,
  isFetchingNote,
}) => {
  return (
    <div className="flex flex-col gap-5 animate-[fadeIn_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-[-0.5px]">Scratchpad</h1>
        <span className="text-xs text-text-muted">
          {isSavingNote ? "Saving..." : "Saved"}
        </span>
      </div>

      <div className="w-full">
        <textarea
          value={noteContent}
          onChange={(e) => updateNote(e.target.value)}
          placeholder={isFetchingNote ? "Loading notes..." : "Write your notes here... (Markdown supported mentally)"}
          rows={24}
          className="w-full resize-y border-none bg-transparent px-0 py-4 text-sm leading-[1.6] text-text-primary outline-none"
        />
      </div>
    </div>
  );
};
