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

    // 👇 THIS WAS MISSING
    const { refresh } = useBrain();

    useFrame(() => {

        brainEngine.update();

        brainChipEngine.update();

        recoveryEngine.update();

        brainSignalPropagation.update();

        console.log(
            brainSignalPropagation.getActiveRegions()
        );

        diseasePropagation.update();

        statisticsEngine.update();

        simulationPlayer.update();

        diseaseEngine.update();

        refresh();

    });

    return null;

}