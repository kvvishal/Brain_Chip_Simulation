"use client";

import { brainEngine } from "../Brain/BrainEngine";

export default function StatusPanel() {

    const regions = brainEngine.getRegions();

    const averageHealth =
        regions.length === 0
            ? 0
            : (
                regions.reduce(
                    (sum, r) => sum + r.health,
                    0
                ) / regions.length
            ) * 100;

    const infected =
        regions.filter(r => r.infected).length;

    const stimulated =
        regions.filter(r => r.stimulated).length;

    return (

        <div className="bg-[#111827] rounded-xl h-full p-6">

            <h2 className="text-xl font-bold text-cyan-400 mb-6">

                Neural Chip Status

            </h2>

            <div className="space-y-5">

                <Metric
                    title="Brain Health"
                    value={`${averageHealth.toFixed(1)} %`}
                    percent={averageHealth}
                    color="bg-green-500"
                />

                <Metric
                    title="Disease Spread"
                    value={`${(
                        infected / regions.length * 100 || 0
                    ).toFixed(1)} %`}
                    percent={
                        infected / regions.length * 100
                    }
                    color="bg-red-500"
                />

                <Metric
                    title="Stimulated Regions"
                    value={stimulated}
                />

                <Metric
                    title="Mode"
                    value={brainEngine.getMode()}
                />

                <Metric
                    title="Chip Status"
                    value={
                        brainEngine.isChipActive()
                            ? "ACTIVE"
                            : "OFF"
                    }
                />

            </div>

        </div>

    );

}

function Metric({

    title,

    value,

    percent,

    color = "bg-cyan-500"

}: {

    title: string;

    value: any;

    percent?: number;

    color?: string;

}) {

    return (

        <div className="space-y-2">

            <div className="flex justify-between">

                <span className="text-slate-400">

                    {title}

                </span>

                <span className="font-semibold text-white">

                    {value}

                </span>

            </div>

            {percent !== undefined && (

                <div className="h-2 rounded bg-slate-700">

                    <div

                        className={`${color} h-2 rounded transition-all duration-500`}

                        style={{

                            width: `${percent}%`

                        }}

                    />

                </div>

            )}

        </div>

    );

}
