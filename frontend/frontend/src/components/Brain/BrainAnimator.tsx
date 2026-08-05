"use client";

import { useFrame } from "@react-three/fiber";

import { brainEngine } from "./BrainEngine";
import { diseaseEngine } from "./DiseaseEngine";
import { simulationPlayer } from "./SimulationPlayer";
import { statisticsEngine } from "./StatisticsEngine";
import { diseasePropagation } from "./DiseasePropagation";
import { brainChipEngine } from "./BrainChipEngine";
import { useBrain } from "./BrainContext";
import { recoveryHistory } from "./RecoveryHistory";
import { activityHistory } from "./ActivityHistory";
import { diseaseHistory } from "./DiseaseHistory";
import { healthHistory } from "./HealthHistory";
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
        // Record average brain health
        // -----------------------------------------

        const regions = brainEngine.getRegions();

        if (regions.length > 0) {

            const averageHealth =

                regions.reduce(

                    (sum, region) => sum + region.health,

                    0

                ) / regions.length;

            healthHistory.add(
                averageHealth
            );

        }

        // -----------------------------------------
        // Record average disease
        // -----------------------------------------

        const averageDisease =

            regions.reduce(

                (sum, region) => sum + region.disease,

                0

            ) / regions.length;

        diseaseHistory.add(
            averageDisease
        );

        // -----------------------------------------
        // Record recovery progress
        // -----------------------------------------

        recoveryHistory.add(
            recoveryEngine.getRecoveryPercentage() / 100
        );

        // -----------------------------------------
        // 7. Refresh React visualization
        // -----------------------------------------

        refresh();

    });

    return null;

}