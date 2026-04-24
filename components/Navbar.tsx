"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ChatDrawer from "./ChatDrawer";

export default function Navbar({ gwName }: { gwName?: string }) {
  const path = usePathname();
  const isTeams = path.startsWith("/teams");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-lg">⚽</div>
            <span className="font-bold text-white hidden sm:block">FPL Assistant</span>
          </div>

          <nav className="flex gap-1 bg-gray-800/60 rounded-xl p-1">
            <Link
              href="/"
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                !isTeams ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Players
            </Link>
            <Link
              href="/teams"
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isTeams ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Teams
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 hover:border-purple-500/70 text-purple-300 hover:text-white text-sm font-medium transition-all"
            >
              <span>⚽</span>
              <span>AI Assistant</span>
            </button>

            {gwName && (
              <div className="text-right border-l border-gray-700 pl-3 hidden sm:block">
                <p className="text-xs text-gray-400">Current</p>
                <p className="text-sm font-semibold text-purple-400">{gwName}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <ChatDrawer open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
