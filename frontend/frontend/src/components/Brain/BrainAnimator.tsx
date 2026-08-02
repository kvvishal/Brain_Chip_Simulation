"use client";

import { useFrame } from "@react-three/fiber";

import { brainEngine } from "./BrainEngine";
import { diseaseEngine } from "./DiseaseEngine";
import { simulationPlayer } from "./SimulationPlayer";
import { statisticsEngine } from "./StatisticsEngine";
import { diseasePropagation } from "./DiseasePropagation";
import { brainChipEngine } from "./BrainChipEngine";
import { useBrain } from "./BrainContext";
import { activityHistory } from "./ActivityHistory";
import { recoveryEngine } from "./RecoveryEngine";
import { brainSignalPropagation } from "./BrainSignalPropagation";

export default function BrainAnimator() {

    const { refresh } = useBrain();

    useFrame(() => {

        // -----------------------------------------
        // 1. Update healthy brain activity
        // -----------------------------------------

        brainEngine.update();

        // -----------------------------------------
        // 2. Alzheimer's disease propagation
        // -----------------------------------------

        if (
            brainEngine.getMode() === "alzheimer"
        ) {

            diseasePropagation.update();

        }

        // -----------------------------------------
        // 3. Apply disease effects
        // -----------------------------------------

        diseaseEngine.update();

        // -----------------------------------------
        // 4. Brain chip treatment
        // -----------------------------------------

        if (brainEngine.isChipActive()) {

            // AI controller selects target regions
            brainChipEngine.update();

            // Spread stimulation through neural network
            brainSignalPropagation.update();

            // Repair stimulated regions
            recoveryEngine.update();

        }

        // -----------------------------------------
        // 5. Update statistics after all changes
        // -----------------------------------------

        statisticsEngine.update();

        // -----------------------------------------
        // 6. Update simulation controller
        // -----------------------------------------

        simulationPlayer.update();

        activityHistory.add(

            brainEngine
                .getRegions()
                .map(region => region.activity)

        );

        // -----------------------------------------
        // 7. Refresh React visualization
        // -----------------------------------------

        refresh();

    });

    return null;

}