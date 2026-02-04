import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { BoardSelector } from "./components/BoardSelector";
import { KanbanBoard } from "./components/KanbanBoard";
import { Id } from "../convex/_generated/dataModel";

function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "INVALID CREDENTIALS" : "SIGNUP FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-4 border-black bg-white">
          <div className="bg-black text-white p-4">
            <h1 className="font-mono text-2xl md:text-3xl font-bold tracking-tight">
              KANBAN_
            </h1>
            <p className="font-mono text-xs mt-1 text-gray-400">
              BRUTALIST TASK MANAGEMENT
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="font-mono text-xs font-bold block mb-2">
                EMAIL:
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full border-4 border-black p-3 font-mono text-sm focus:outline-none focus:bg-yellow-100 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="font-mono text-xs font-bold block mb-2">
                PASSWORD:
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full border-4 border-black p-3 font-mono text-sm focus:outline-none focus:bg-yellow-100 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="bg-red-500 text-white font-mono text-xs p-3 border-4 border-black">
                ERROR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-mono font-bold py-4 border-4 border-black hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "PROCESSING..."
                : flow === "signIn"
                  ? ">> LOGIN"
                  : ">> REGISTER"}
            </button>

            <button
              type="button"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="w-full font-mono text-xs underline hover:bg-black hover:text-white p-2 transition-colors"
            >
              {flow === "signIn"
                ? "NO ACCOUNT? REGISTER HERE"
                : "HAVE ACCOUNT? LOGIN HERE"}
            </button>
          </form>

          <div className="border-t-4 border-black p-4">
            <button
              onClick={() => signIn("anonymous")}
              className="w-full bg-gray-200 font-mono text-xs py-3 border-4 border-black hover:bg-black hover:text-white transition-all"
            >
              CONTINUE AS GUEST →
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block border-2 border-black bg-white px-4 py-2">
            <span className="font-mono text-xs">
              REAL-TIME • AUTHENTICATED • PERSISTENT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block border-4 border-black bg-white p-8 animate-pulse">
          <div className="font-mono text-2xl font-bold">LOADING_</div>
          <div className="font-mono text-xs mt-2 text-gray-500">
            INITIALIZING SYSTEM...
          </div>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const { signOut } = useAuthActions();
  const [selectedBoardId, setSelectedBoardId] = useState<Id<"boards"> | null>(
    null
  );

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col">
      {/* Header */}
      <header className="bg-black text-white border-b-4 border-black">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3">
          <div className="flex items-center gap-4">
            <h1 className="font-mono text-xl md:text-2xl font-bold tracking-tight">
              KANBAN_
            </h1>
            <div className="hidden md:block h-6 w-px bg-white/30" />
            <span className="hidden md:block font-mono text-xs text-gray-400">
              BRUTALIST BOARD
            </span>
          </div>
          <button
            onClick={() => signOut()}
            className="self-start sm:self-auto bg-white text-black font-mono text-xs px-4 py-2 border-2 border-white hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
          >
            LOGOUT [X]
          </button>
        </div>
      </header>

      {/* Board Selector */}
      <BoardSelector
        selectedBoardId={selectedBoardId}
        onSelectBoard={setSelectedBoardId}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {selectedBoardId ? (
          <KanbanBoard boardId={selectedBoardId} />
        ) : (
          <div className="h-full flex items-center justify-center p-4">
            <div className="text-center">
              <div className="inline-block border-4 border-black bg-white p-8 md:p-12">
                <div className="font-mono text-4xl md:text-6xl font-bold mb-4">
                  [?]
                </div>
                <div className="font-mono text-sm md:text-base">
                  SELECT OR CREATE A BOARD
                </div>
                <div className="font-mono text-xs text-gray-500 mt-2">
                  USE THE CONTROLS ABOVE
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-black p-3">
        <div className="text-center font-mono text-xs text-gray-400">
          Requested by @OxPaulius · Built by @clonkbot
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <AuthScreen />;
  return <MainApp />;
}
