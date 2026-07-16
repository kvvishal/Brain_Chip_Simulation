"use client";

import { brainEngine } from "../Brain/BrainEngine";

export default function BrainStatistics() {

    const regions = brainEngine.getRegions();

    return (

        <div className="bg-[#111827] rounded-xl h-full p-6">

            <h2 className="text-xl text-cyan-400 font-bold mb-5">

                Brain Statistics

            </h2>

            <p className="text-slate-300">

                Total Regions : {regions.length}

            </p>

            <p className="text-slate-300 mt-2">

                Healthy Regions :

                {" "}

                {regions.filter(r => !r.infected).length}

            </p>

            <p className="text-slate-300 mt-2">

                Damaged Regions :

                {" "}

                {regions.filter(r => r.infected).length}

            </p>

            <p className="text-slate-300 mt-2">

                Active Chip :

                {" "}

                {brainEngine.isChipActive() ? "Yes" : "No"}

            </p>

        </div>

    );

}