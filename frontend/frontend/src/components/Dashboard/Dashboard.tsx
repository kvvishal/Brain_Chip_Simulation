"use client";

import BrainCanvas from "../Brain/BrainCanvas";
import LeftPanel from "../Layout/LeftPanel";
import StatusPanel from "./StatusPanel";
import BrainStatistics from "./BrainStatistics";
import EventLog from "./EventLog";
import BrainActivityChart from "../Brain/BrainActivityChart";

export default function Dashboard() {
    return (
        <main
            className="
                min-h-screen
                w-full
                bg-[#050816]
                p-3
                sm:p-4
                lg:p-5
            "
        >

            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl sm:text-2xl font-bold text-cyan-400">
                    Brain Chip Simulation
                </h1>

                <p className="text-xs sm:text-sm text-blue-300 mt-1">
                    Neural activity, Alzheimer's progression and adaptive chip treatment
                </p>
            </div>

            {/* ================= TOP ================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-12
                    gap-4
                    lg:gap-6
                    items-start
                "
            >

                {/* Controls */}
                <div
                    className="
                        md:col-span-12
                        lg:col-span-3
                        xl:col-span-2
                    "
                >
                    <LeftPanel />
                </div>

                {/* Brain */}
                <div
                    className="
                        md:col-span-8
                        lg:col-span-6
                        xl:col-span-7

                        bg-[#111827]
                        border
                        border-slate-700
                        rounded-xl
                        overflow-hidden
                    "
                >
                    <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-700">
                        <h2 className="font-semibold text-cyan-400">
                            Neural Network Visualization
                        </h2>
                    </div>

                    <div
                        className="
                            h-[320px]
                            sm:h-[380px]
                            lg:h-[440px]
                            xl:h-[500px]
                            2xl:h-[540px]
                        "
                    >
                        <BrainCanvas />
                    </div>
                </div>

                {/* Status */}
                <div
                    className="
                        md:col-span-4
                        lg:col-span-3
                        xl:col-span-3
                    "
                >
                    <StatusPanel />
                </div>

            </div>

            {/* ================= BOTTOM ================= */}

            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-12
                    gap-4
                    lg:gap-6
                    mt-4
                    lg:mt-6
                "
            >

                {/* Brain Activity Chart */}

                <div
                    className="
                        lg:col-span-8
                        bg-[#111827]
                        border
                        border-slate-700
                        rounded-xl
                        overflow-hidden
                    "
                >

                    <div className="px-4 py-3 border-b border-slate-700">

                        <h2 className="font-semibold text-cyan-400">

                            Brain Activity Over Time

                        </h2>

                    </div>

                    <div className="h-[320px] p-4">

                        <BrainActivityChart />

                    </div>

                </div>

                {/* Right Column */}

                <div
                    className="
                        lg:col-span-4
                        flex
                        flex-col
                        gap-4
                    "
                >

                    <BrainStatistics />

                    <EventLog />

                </div>

            </div>

        </main>
    );
}