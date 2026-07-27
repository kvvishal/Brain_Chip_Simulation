"use client";

import { useFrame } from "@react-three/fiber";

import { brainEngine } from "./BrainEngine";
import { diseaseEngine } from "./DiseaseEngine";
import { simulationPlayer } from "./SimulationPlayer";
import { statisticsEngine } from "./StatisticsEngine";
import { diseasePropagation } from "./DiseasePropagation";
import { brainChipEngine } from "./BrainChipEngine";
import { useBrain } from "./BrainContext";
import { recoveryEngine } from "./RecoveryEngine";
import { brainSignalPropagation } from "./BrainSignalPropagation";

export default function BrainAnimator() {

    const { refresh } = useBrain();

    useFrame(() => {

        // -----------------------------------------
        // 1. Update base brain state
        // -----------------------------------------

        brainEngine.update();

        // -----------------------------------------
        // 2. Alzheimer's progression
        // -----------------------------------------

        if (
            brainEngine.getMode() === "alzheimer"
        ) {

            diseasePropagation.update();

        }

        // -----------------------------------------
        // 3. Brain chip
        // -----------------------------------------

        if (brainEngine.isChipActive()) {

            // AI/chip controller
            brainChipEngine.update();

            // Spread stimulation through network
            brainSignalPropagation.update();

            // Repair regions reached by stimulation
            recoveryEngine.update();

        }

        // -----------------------------------------
        // 4. Other simulation engines
        // -----------------------------------------

        statisticsEngine.update();

        simulationPlayer.update();

        diseaseEngine.update();

        // -----------------------------------------
        // 5. Update React visualization
        // -----------------------------------------

        refresh();

    });

    return null;
}