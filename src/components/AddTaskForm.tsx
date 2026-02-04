import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface AddTaskFormProps {
  boardId: Id<"boards">;
  columnId: Id<"columns">;
}

export function AddTaskForm({ boardId, columnId }: AddTaskFormProps) {
  const createTask = useMutation(api.tasks.create);

  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      boardId,
      columnId,
    });
    setTitle("");
    setDescription("");
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full font-mono text-xs p-3 hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">+</span>
        <span>ADD TASK</span>
      </button>
    );
  }

  return (
    <div className="p-3 bg-gray-100">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
        placeholder="TASK TITLE"
        autoFocus
        className="w-full font-mono text-sm p-2 border-2 border-black mb-2 focus:outline-none focus:bg-yellow-100"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="DESCRIPTION (OPTIONAL)"
        className="w-full font-mono text-xs p-2 border-2 border-black mb-2 resize-none focus:outline-none focus:bg-yellow-100"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="flex-1 font-mono text-xs py-2 bg-black text-white border-2 border-black hover:bg-green-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          CREATE
        </button>
        <button
          onClick={() => {
            setIsExpanded(false);
            setTitle("");
            setDescription("");
          }}
          className="flex-1 font-mono text-xs py-2 bg-gray-200 border-2 border-black hover:bg-gray-300 transition-all"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
