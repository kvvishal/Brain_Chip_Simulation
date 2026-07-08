"use client";

import { useFrame } from "@react-three/fiber";
import { brainEngine } from "./BrainEngine";
import { diseaseEngine } from "./DiseaseEngine";

export default function BrainAnimator() {

    useFrame(() => {

        brainEngine.update();

        diseaseEngine.update();

    });

    return null;

}