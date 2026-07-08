"use client";

export default function TopBar() {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-cyan-400">
        🧠 Brain Chip Simulator
      </h1>

      <div className="text-gray-300">
        Research Mode
      </div>
    </header>
  );
}