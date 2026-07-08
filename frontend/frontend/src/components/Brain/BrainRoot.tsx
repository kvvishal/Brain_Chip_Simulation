"use client";

import BrainModel from "./BrainModel";
import BrainRegions from "./BrainRegions";
import BrainConnections from "./BrainConnections";
import BrainAnimator from "./BrainAnimator";

export default function BrainRoot() {

    return (

        <group>

            <BrainAnimator />

            <BrainModel />

            <BrainConnections />

            <BrainRegions />

        </group>

    );

}