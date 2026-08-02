"use client";

import { brainEngine } from "../Brain/BrainEngine";
import { useBrain } from "../Brain/BrainContext";
import { diseaseEngine } from "../Brain/DiseaseEngine";
import { simulationPlayer } from "../Brain/SimulationPlayer";
import { simulationManager } from "@/simulation/SimulationManager";
import { diseasePropagation } from "../Brain/DiseasePropagation";
import { brainSignalPropagation } from "../Brain/BrainSignalPropagation";
import { brainChipEngine } from "../Brain/BrainChipEngine";
import { recoveryEngine } from "../Brain/RecoveryEngine";

const RIGHT_HIPPOCAMPUS = 15;
const LEFT_HIPPOCAMPUS = 63;

export default function LeftPanel() {

    const { refresh } = useBrain();

    // ==================================================
    // COMPLETE RESET
    // ==================================================

    function resetSimulation() {

        simulationPlayer.pause();

        diseaseEngine.stop();

        diseasePropagation.stop();

        brainSignalPropagation.reset();

        brainChipEngine.reset();

        recoveryEngine.reset();

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
         * Do NOT reset the entire simulation.
         * The chip treats the Alzheimer's damage
         * already present in the brain.
         */

        brainSignalPropagation.reset();

        brainChipEngine.reset();

        // --------------------------------------------------
        // If selected directly from Healthy mode,
        // first create Alzheimer's damage.
        // --------------------------------------------------

        if (
            brainEngine.getMode() === "healthy"
        ) {

            const started =
                startAlzheimerDisease();

            if (!started) {
                return;
            }
        }

        // --------------------------------------------------
        // Freeze Alzheimer's progression
        // --------------------------------------------------

        diseasePropagation.stop();

        diseaseEngine.stop();

        // --------------------------------------------------
        // Enter chip mode
        // --------------------------------------------------

        brainEngine.setMode(
            "chip"
        );

        brainEngine.activateChip();

        // --------------------------------------------------
        // Update physical chip field
        // --------------------------------------------------

        brainChipEngine.update();

        // --------------------------------------------------
        // Select adaptive target
        // --------------------------------------------------

        let target =
            brainChipEngine
                .selectTargetRegion();

        // --------------------------------------------------
        // Fallback
        // --------------------------------------------------

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

        // --------------------------------------------------
        // Final target validation
        // --------------------------------------------------

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

        // --------------------------------------------------
        // Debug information
        // --------------------------------------------------

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

        // --------------------------------------------------
        // Begin treatment propagation
        // --------------------------------------------------

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

        <aside
            className="
                w-full
                min-w-0
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-4
                sm:p-5
                overflow-hidden
            "
        >

            <h2
                className="
                    text-lg
                    sm:text-xl
                    font-semibold
                    text-white
                    mb-5
                    sm:mb-6
                "
            >
                Controls
            </h2>

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    w-full
                    min-w-0
                "
            >

                {/* Healthy Brain */}

                <button
                    onClick={healthy}
                    className="
                        w-full
                        min-w-0
                        px-3
                        sm:px-4
                        py-3
                        rounded-md

                        bg-cyan-600
                        hover:bg-cyan-500

                        text-white
                        text-sm
                        sm:text-base
                        font-medium

                        whitespace-normal
                        break-words

                        transition-colors
                        duration-200

                        focus:outline-none
                        focus:ring-2
                        focus:ring-cyan-300
                    "
                >
                    Healthy Brain
                </button>

                {/* Alzheimer's */}

                <button
                    onClick={alzheimer}
                    className="
                        w-full
                        min-w-0
                        px-3
                        sm:px-4
                        py-3
                        rounded-md

                        bg-red-700
                        hover:bg-red-600

                        text-white
                        text-sm
                        sm:text-base
                        font-medium

                        whitespace-normal
                        break-words

                        transition-colors
                        duration-200

                        focus:outline-none
                        focus:ring-2
                        focus:ring-red-300
                    "
                >
                    Alzheimer's
                </button>

                {/* Brain Chip */}

                <button
                    onClick={chip}
                    className="
                        w-full
                        min-w-0
                        px-3
                        sm:px-4
                        py-3
                        rounded-md

                        bg-green-700
                        hover:bg-green-600

                        text-white
                        text-sm
                        sm:text-base
                        font-medium

                        whitespace-normal
                        break-words

                        transition-colors
                        duration-200

                        focus:outline-none
                        focus:ring-2
                        focus:ring-green-300
                    "
                >
                    Brain Chip
                </button>

            </div>

        </aside>
    );
}