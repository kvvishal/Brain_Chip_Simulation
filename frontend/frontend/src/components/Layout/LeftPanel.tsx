"use client";

import { useState } from "react";
import { brainEngine } from "../Brain/BrainEngine";
import { useBrain } from "../Brain/BrainContext";
import { diseaseEngine } from "../Brain/DiseaseEngine";

export default function LeftPanel() {

    const { refresh } = useBrain();

    function healthy() {

        brainEngine.setHealthy();

        diseaseEngine.stop()

        refresh();

    }

    function alzheimer() {

        brainEngine.setAlzheimer();

        diseaseEngine.start();

        refresh();

    }

    function chip() {

        brainEngine.activateChip();

        diseaseEngine.stop();

        refresh();

    }

    return (

        <aside className="w-72 bg-slate-900 border-r border-slate-700 p-5">

            <h2 className="text-xl font-semibold text-white mb-6">

                Controls

            </h2>

            <button

                onClick={healthy}

                className="w-full mb-3 p-3 rounded bg-cyan-600 hover:bg-cyan-500"

            >

                Healthy Brain

            </button>

            <button

                onClick={alzheimer}

                className="w-full mb-3 p-3 rounded bg-red-700 hover:bg-red-600"

            >

                Alzheimer's

            </button>

            <button

                onClick={chip}

                className="w-full mb-3 p-3 rounded bg-green-700 hover:bg-green-600"

            >

                Brain Chip

            </button>

        </aside>

    );

}