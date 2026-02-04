import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { AddTaskForm } from "./AddTaskForm";

interface KanbanBoardProps {
  boardId: Id<"boards">;
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const board = useQuery(api.boards.get, { id: boardId });
  const columns = useQuery(api.columns.listByBoard, { boardId });
  const tasks = useQuery(api.tasks.listByBoard, { boardId });
  const createColumn = useMutation(api.columns.create);
  const moveTask = useMutation(api.tasks.move);

  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [draggedTask, setDraggedTask] = useState<Doc<"tasks"> | null>(null);

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    await createColumn({ boardId, name: newColumnName.toUpperCase() });
    setNewColumnName("");
    setIsAddingColumn(false);
  };

  const handleDragStart = (task: Doc<"tasks">) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId: Id<"columns">) => {
    if (!draggedTask) return;

    const tasksInColumn =
      tasks?.filter((t: Doc<"tasks">) => t.columnId === columnId && t._id !== draggedTask._id) || [];

    await moveTask({
      id: draggedTask._id,
      columnId,
      order: tasksInColumn.length,
    });

    setDraggedTask(null);
  };

  if (board === undefined || columns === undefined || tasks === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="font-mono text-sm animate-pulse">LOADING BOARD...</div>
      </div>
    );
  }

  if (board === null) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="font-mono text-sm text-red-500">
          ERROR: BOARD NOT FOUND
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Board Header */}
      <div className="bg-yellow-400 border-b-4 border-black p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-black" />
          <h2 className="font-mono text-lg md:text-xl font-bold">{board.name}</h2>
          <div className="w-4 h-4 bg-black" />
        </div>
      </div>

      {/* Columns Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full p-4 gap-4 min-w-max">
          {columns.map((column: Doc<"columns">) => {
            const columnTasks = tasks.filter((t: Doc<"tasks">) => t.columnId === column._id);

            return (
              <div
                key={column._id}
                className="w-72 md:w-80 flex flex-col bg-white border-4 border-black shrink-0"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column._id)}
              >
                {/* Column Header */}
                <div className="bg-black text-white p-3 flex items-center justify-between">
                  <span className="font-mono text-sm font-bold">
                    {column.name}
                  </span>
                  <span className="font-mono text-xs bg-white text-black px-2 py-1">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px] bg-[repeating-linear-gradient(0deg,transparent,transparent_19px,#e5e5e5_19px,#e5e5e5_20px)]">
                  {columnTasks.map((task: Doc<"tasks">) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onDragStart={() => handleDragStart(task)}
                    />
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="border-2 border-dashed border-gray-300 p-4 text-center">
                      <span className="font-mono text-xs text-gray-400">
                        DROP TASKS HERE
                      </span>
                    </div>
                  )}
                </div>

                {/* Add Task */}
                <div className="border-t-4 border-black">
                  <AddTaskForm boardId={boardId} columnId={column._id} />
                </div>
              </div>
            );
          })}

          {/* Add Column */}
          <div className="w-72 md:w-80 shrink-0">
            {isAddingColumn ? (
              <div className="bg-white border-4 border-black p-4">
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                  placeholder="COLUMN NAME"
                  autoFocus
                  className="w-full font-mono text-sm p-3 border-4 border-black focus:outline-none focus:bg-yellow-100"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleAddColumn}
                    className="flex-1 font-mono text-xs py-2 bg-black text-white border-2 border-black hover:bg-green-500 transition-all"
                  >
                    CREATE
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingColumn(false);
                      setNewColumnName("");
                    }}
                    className="flex-1 font-mono text-xs py-2 bg-gray-200 border-2 border-black hover:bg-gray-300 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="w-full h-32 border-4 border-dashed border-black bg-white/50 hover:bg-white hover:border-solid font-mono text-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="text-2xl">+</span>
                <span>ADD COLUMN</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
