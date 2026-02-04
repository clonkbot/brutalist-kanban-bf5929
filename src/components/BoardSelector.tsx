import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";

interface BoardSelectorProps {
  selectedBoardId: Id<"boards"> | null;
  onSelectBoard: (id: Id<"boards"> | null) => void;
}

export function BoardSelector({
  selectedBoardId,
  onSelectBoard,
}: BoardSelectorProps) {
  const boards = useQuery(api.boards.list);
  const createBoard = useMutation(api.boards.create);
  const removeBoard = useMutation(api.boards.remove);

  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const handleCreate = async () => {
    if (!newBoardName.trim()) return;
    const boardId = await createBoard({ name: newBoardName.toUpperCase() });
    setNewBoardName("");
    setIsCreating(false);
    onSelectBoard(boardId);
  };

  const handleDelete = async (id: Id<"boards">) => {
    if (selectedBoardId === id) {
      onSelectBoard(null);
    }
    await removeBoard({ id });
  };

  return (
    <div className="bg-white border-b-4 border-black">
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold mr-2">BOARDS:</span>

          {boards === undefined ? (
            <span className="font-mono text-xs text-gray-500">LOADING...</span>
          ) : boards.length === 0 ? (
            <span className="font-mono text-xs text-gray-500">
              NO BOARDS YET
            </span>
          ) : (
            boards.map((board: { _id: Id<"boards">; name: string }) => (
              <div key={board._id} className="flex items-stretch">
                <button
                  onClick={() => onSelectBoard(board._id)}
                  className={`font-mono text-xs px-3 py-2 border-2 border-black transition-all ${
                    selectedBoardId === board._id
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-yellow-400"
                  }`}
                >
                  {board.name}
                </button>
                <button
                  onClick={() => handleDelete(board._id)}
                  className="font-mono text-xs px-2 border-2 border-l-0 border-black bg-red-500 text-white hover:bg-red-700 transition-all"
                  title="Delete board"
                >
                  X
                </button>
              </div>
            ))
          )}

          {isCreating ? (
            <div className="flex items-stretch">
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="BOARD NAME"
                autoFocus
                className="font-mono text-xs px-3 py-2 border-2 border-black w-32 focus:outline-none focus:bg-yellow-100"
              />
              <button
                onClick={handleCreate}
                className="font-mono text-xs px-3 border-2 border-l-0 border-black bg-black text-white hover:bg-green-500 transition-all"
              >
                +
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewBoardName("");
                }}
                className="font-mono text-xs px-3 border-2 border-l-0 border-black bg-gray-200 hover:bg-gray-300 transition-all"
              >
                X
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="font-mono text-xs px-3 py-2 border-2 border-dashed border-black hover:border-solid hover:bg-black hover:text-white transition-all"
            >
              + NEW BOARD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
