"use client";

import { useEffect } from "react";
import BrainModel from "./BrainModel";
import BrainRegions from "./BrainRegions";
import BrainConnections from "./BrainConnections";
import BrainAnimator from "./BrainAnimator";
import BrainChip from "./BrainChip";
import { simulationPlayer } from "./SimulationPlayer";
import BrainPulse from "./BrainPulse";

export default function BrainRoot() {

    useEffect(() => {

        simulationPlayer.initialize();

    }, []);

    return (

        <group>

            <BrainAnimator />

            <BrainModel />

            <BrainConnections />

            <BrainRegions />

            <BrainChip />

            <BrainPulse />

        </group>

    );

}