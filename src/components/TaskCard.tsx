import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface TaskCardProps {
  task: Doc<"tasks">;
  onDragStart: () => void;
}

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );

  const handleSave = async () => {
    await updateTask({
      id: task._id,
      title: editTitle,
      description: editDescription || undefined,
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await removeTask({ id: task._id });
  };

  if (isEditing) {
    return (
      <div className="bg-yellow-100 border-4 border-black p-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full font-mono text-sm p-2 border-2 border-black mb-2 focus:outline-none"
          placeholder="TASK TITLE"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full font-mono text-xs p-2 border-2 border-black mb-2 resize-none focus:outline-none"
          rows={2}
          placeholder="DESCRIPTION (OPTIONAL)"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 font-mono text-xs py-2 bg-black text-white border-2 border-black hover:bg-green-500 transition-all"
          >
            SAVE
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditDescription(task.description || "");
            }}
            className="flex-1 font-mono text-xs py-2 bg-gray-200 border-2 border-black hover:bg-gray-300 transition-all"
          >
            CANCEL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      className="bg-white border-4 border-black p-3 cursor-grab active:cursor-grabbing hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-sm font-bold break-words">
            {task.title}
          </h3>
          {task.description && (
            <p className="font-mono text-xs text-gray-600 mt-1 break-words">
              {task.description}
            </p>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="font-mono text-xs px-2 py-1 bg-yellow-400 border-2 border-black hover:bg-yellow-500 transition-all"
            title="Edit"
          >
            E
          </button>
          <button
            onClick={handleDelete}
            className="font-mono text-xs px-2 py-1 bg-red-500 text-white border-2 border-black hover:bg-red-700 transition-all"
            title="Delete"
          >
            X
          </button>
        </div>
      </div>

      {/* Visual indicator */}
      <div className="flex gap-1 mt-3">
        <div className="h-1 w-4 bg-black" />
        <div className="h-1 w-2 bg-black" />
        <div className="h-1 w-1 bg-black" />
      </div>
    </div>
  );
}
