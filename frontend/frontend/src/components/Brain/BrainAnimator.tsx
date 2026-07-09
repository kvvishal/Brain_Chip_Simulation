"use client";

import { useFrame } from "@react-three/fiber";
import { brainEngine } from "./BrainEngine";
import { diseaseEngine } from "./DiseaseEngine";
import { simulationPlayer } from "./SimulationPlayer";
import { statisticsEngine } from "./StatisticsEngine";
import { diseasePropagation } from "./DiseasePropagation";
import { refresh } from "next/cache";

export default function BrainAnimator() {

    useFrame(() => {

        brainEngine.update();

        diseasePropagation.update();

        diseasePropagation.update();

        statisticsEngine.update();
        
        simulationPlayer.update();

    });

    return null;

}