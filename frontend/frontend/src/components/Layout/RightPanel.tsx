"use client";

export default function RightPanel() {
  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-700 p-5">

      <h2 className="text-xl font-semibold text-white mb-5">
        Brain Statistics
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-gray-400">Regions</p>
          <p className="text-cyan-400 text-xl">96</p>
        </div>

        <div>
          <p className="text-gray-400">Connections</p>
          <p className="text-cyan-400 text-xl">1302</p>
        </div>

        <div>
          <p className="text-gray-400">Activity</p>
          <p className="text-green-400 text-xl">Healthy</p>
        </div>

      </div>

    </aside>
  );
}