"use client";

import { brainEngine } from "../Brain/BrainEngine";
import { useBrain } from "../Brain/BrainContext";
import { diseaseEngine } from "../Brain/DiseaseEngine";
import { simulationPlayer } from "../Brain/SimulationPlayer";
import { simulationManager } from "@/simulation/SimulationManager";
import { diseasePropagation } from "../Brain/DiseasePropagation";
import { brainSignalPropagation } from "../Brain/BrainSignalPropagation";
import { brainChipEngine } from "../Brain/BrainChipEngine";

const RIGHT_HIPPOCAMPUS = 15;
const LEFT_HIPPOCAMPUS = 63;

export default function LeftPanel() {

    const { refresh } = useBrain();

    // ==================================================
    // COMPLETE RESET
    // Used only when creating a fresh Healthy brain
    // or starting Alzheimer's from scratch
    // ==================================================

    function resetSimulation() {

        simulationPlayer.pause();

        diseaseEngine.stop();

        diseasePropagation.stop();

        brainSignalPropagation.reset();

        brainChipEngine.reset();

        brainEngine.deactivateChip();

        brainEngine.setHealthy();
    }

    // ==================================================
    // CREATE ALZHEIMER'S STATE
    // ==================================================

    function startAlzheimerDisease() {

        const regionCount =
            brainEngine.getRegionCount();

        if (regionCount === 0) {

            console.warn(
                "Brain has not initialized yet."
            );

            return false;
        }

        if (
            RIGHT_HIPPOCAMPUS >= regionCount ||
            LEFT_HIPPOCAMPUS >= regionCount
        ) {

            console.error(
                "Hippocampal region IDs are invalid."
            );

            return false;
        }

        brainEngine.setAlzheimer();

        simulationManager.setMode(
            "alzheimer"
        );

        const rightHC =
            brainEngine.getRegion(
                RIGHT_HIPPOCAMPUS
            );

        const leftHC =
            brainEngine.getRegion(
                LEFT_HIPPOCAMPUS
            );

        console.log(
            "Right hippocampus:",
            RIGHT_HIPPOCAMPUS,
            rightHC.name
        );

        console.log(
            "Left hippocampus:",
            LEFT_HIPPOCAMPUS,
            leftHC.name
        );

        // Mild bilateral involvement
        leftHC.disease = 0.20;
        leftHC.infected = true;

        // Main disease starts from right hippocampus
        diseasePropagation.start(
            RIGHT_HIPPOCAMPUS
        );

        return true;
    }

    // ==================================================
    // HEALTHY
    // ==================================================

    function healthy() {

        resetSimulation();

        brainEngine.setMode(
            "healthy"
        );

        simulationPlayer.restart();

        simulationPlayer.play();

        console.log(
            "MODE: HEALTHY"
        );

        refresh();
    }

    // ==================================================
    // ALZHEIMER'S
    // ==================================================

    function alzheimer() {

        resetSimulation();

        brainEngine.setMode(
            "alzheimer"
        );

        const started =
            startAlzheimerDisease();

        if (!started) {
            return;
        }

        console.log(
            "MODE: ALZHEIMER"
        );

        refresh();
    }

    // ==================================================
    // BRAIN CHIP
    // ==================================================

    function chip() {

        const regionCount =
            brainEngine.getRegionCount();

        if (regionCount === 0) {

            console.warn(
                "Cannot activate chip: brain not initialized."
            );

            return;
        }

        /*
        * IMPORTANT:
        *
        * Do NOT reset the entire simulation.
        * The chip must treat the Alzheimer's
        * damage already present in the brain.
        */

        brainSignalPropagation.reset();
        brainChipEngine.reset();

        // ----------------------------------------------
        // If selected directly from Healthy mode,
        // first create Alzheimer's damage.
        // ----------------------------------------------

        if (
            brainEngine.getMode() === "healthy"
        ) {

            const started =
                startAlzheimerDisease();

            if (!started) {
                return;
            }
        }

        // ----------------------------------------------
        // Freeze Alzheimer's progression
        // ----------------------------------------------

        /*
        * Existing damage stays.
        *
        * New disease propagation stops so recovery
        * is not fighting disease progression at
        * the same time.
        */

        diseasePropagation.stop();
        diseaseEngine.stop();

        // ----------------------------------------------
        // Enter chip mode
        // ----------------------------------------------

        brainEngine.setMode(
            "chip"
        );

        brainEngine.activateChip();

        // ----------------------------------------------
        // Update physical chip field once
        // ----------------------------------------------

        brainChipEngine.update();

        // ----------------------------------------------
        // Select adaptive target ONCE
        // ----------------------------------------------

        let target =
            brainChipEngine
                .selectTargetRegion();

        // ----------------------------------------------
        // Fallback
        // ----------------------------------------------

        /*
        * This should only happen if no damaged
        * region qualifies for adaptive treatment.
        */

        if (target === null) {

            console.warn(
                "No adaptive treatment target found. Using nearest region."
            );

            const nearest =
                brainChipEngine
                    .getNearestRegion();

            if (
                nearest < 0 ||
                nearest >= regionCount
            ) {

                console.error(
                    "Unable to find valid chip target."
                );

                brainEngine.deactivateChip();

                brainEngine.setMode(
                    "alzheimer"
                );

                return;
            }

            target = nearest;

            brainChipEngine
                .setTargetRegion(
                    target
                );
        }

        // ----------------------------------------------
        // Final target validation
        // ----------------------------------------------

        if (
            target < 0 ||
            target >= regionCount
        ) {

            console.error(
                "Invalid chip stimulation target:",
                target
            );

            brainEngine.deactivateChip();

            brainEngine.setMode(
                "alzheimer"
            );

            return;
        }

        const targetRegion =
            brainEngine.getRegion(
                target
            );

        // ----------------------------------------------
        // Debug information
        // ----------------------------------------------

        console.log(
            "Adaptive chip target:",
            target,
            targetRegion.name
        );

        console.log(
            "Target disease:",
            targetRegion.disease
        );

        console.log(
            "Target health:",
            targetRegion.health
        );

        console.log(
            "Target activity:",
            targetRegion.activity
        );

        // ----------------------------------------------
        // Begin treatment propagation
        // ----------------------------------------------

        brainSignalPropagation.start(
            target
        );

        console.log(
            "MODE: CHIP"
        );

        refresh();
    }

    // ==================================================
    // UI
    // ==================================================

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