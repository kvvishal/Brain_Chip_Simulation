"use client";

export default function BottomBar() {
  return (
    <footer className="h-16 bg-slate-900 border-t border-slate-700 flex items-center justify-center text-gray-300">

      ▶ Play

      <span className="mx-6">
        ⏸ Pause
      </span>

      Speed: 1×

    </footer>
  );
}