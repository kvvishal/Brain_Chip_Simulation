"use client";

import React, { useEffect, useState } from "react";

import BrainConnection from "./BrainConnection";
import BrainSignal from "./BrainSignals";
import { brainSignalPropagation } from "./BrainSignalPropagation";

import * as THREE from "three";


import { loadConnections } from "@/api/brainConnectionAPI";
import { loadRegions } from "@/api/brainAPI";

import { coordinateTransformer } from "./CoordinateTransformer";
import { brainPositionStore } from "./BrainPositionStore";

import { brainEngine } from "./BrainEngine";
import { brainGraph } from "./BrainGraph";

type Connection = {
    source: number;
    target: number;
    weight: number;
};

// --------------------------------------------------
// Signal colour according to anatomical region
// --------------------------------------------------

function getSignalColor(name: string) {

    // Prefrontal cortex
    if (name.includes("PFC"))
        return "#00BFFF";

    if (name.includes("MFC"))
        return "#00BFFF";


    // Parietal cortex
    if (name.includes("PC"))
        return "#00FF7F";

    if (name.includes("SPL"))
        return "#00FF7F";


    // Temporal cortex
    if (name.includes("TC"))
        return "#FF00FF";


    // Occipital cortex
    if (name.includes("OC"))
        return "#FFD700";


    // Amygdala
    if (name.includes("Amyg"))
        return "#FF4040";


    // Parahippocampal cortex
    if (name.includes("PHC"))
        return "#FF4040";


    /*
     * IMPORTANT:
     *
     * Your atlas uses:
     *
     * RM-HC_R
     * RM-HC_L
     *
     * for hippocampus.
     */
    if (name.includes("HC"))
        return "#FF4040";


    // Cerebellum
    if (name.includes("Cb"))
        return "#00FFFF";


    return "#FFFFFF";
}

// ==================================================
// Brain Connections
// ==================================================

export default function BrainConnections() {

    const [connections, setConnections] =
        useState<Connection[]>([]);

    const points =
        brainPositionStore.get();

    // --------------------------------------------------
    // Load connections
    // --------------------------------------------------

    useEffect(() => {

        Promise.all([

            loadConnections(),
            loadRegions()

        ])
        .then(([connectionData, regionData]) => {

            // Build graph used by disease/chip propagation
            brainGraph.initialize(
                connectionData
            );

            setConnections(
                connectionData
            );

            console.log(
                "Connections loaded:",
                connectionData.length
            );

            console.log(
                "Regions loaded:",
                regionData.regions.length
            );

        })
        .catch((error) => {

            console.error(
                "Failed to load brain connections:",
                error
            );

        });

    }, []);

    // --------------------------------------------------
    // Wait for coordinate system
    // --------------------------------------------------

    if (!coordinateTransformer.isReady()) {

        return null;

    }

    // --------------------------------------------------
    // Wait for BrainEngine initialization
    // --------------------------------------------------

    const regionCount =
        brainEngine.getRegionCount();

    if (regionCount === 0) {

        return null;

    }

    const averageDisease =
        brainEngine
            .getRegions()
            .reduce(
                (sum, region) => sum + region.disease,
                0
            ) / regionCount;

    const MAX_CONNECTIONS =
        Math.round(
            100 +
            averageDisease * 80
        );
    // ==================================================
    // Render
    // ==================================================

    return (

        <>

            {

                connections

                    .filter(connection => connection.weight >= 1.5)

                    .sort((a, b) => b.weight - a.weight)

                    .slice(0, MAX_CONNECTIONS)

                    .map((connection) => {
                        
                        const source =
                            connection.source;

                        const target =
                            connection.target;

                        // ----------------------------------
                        // Safety check
                        // ----------------------------------

                        if (
                            source < 0 ||
                            target < 0 ||
                            source >= regionCount ||
                            target >= regionCount
                        ) {

                            return null;

                        }

                        // ----------------------------------
                        // Positions
                        // ----------------------------------

                        const start =
                            points[source];

                        const end =
                            points[target];

                        if (!start || !end) {

                            return null;

                        }

                        // ----------------------------------
                        // Brain states
                        // ----------------------------------

                        const sourceState =
                            brainEngine.getRegion(
                                source
                            );

                        const targetState =
                            brainEngine.getRegion(
                                target
                            );

                        // ----------------------------------
                        // Neural activity
                        // ----------------------------------

                        const activity =
                            (
                                sourceState.activity +
                                targetState.activity
                            ) / 2;

                        // ----------------------------------
                        // Alzheimer's disease level
                        // ----------------------------------

                        const disease =
                            Math.max(

                                sourceState.disease,

                                targetState.disease

                            );

                        /*
                         * Connection remains anatomically
                         * visible even when damaged.
                         *
                         * Healthy:
                         *      strength ~ 1
                         *
                         * Alzheimer's:
                         *      strength decreases
                         *
                         * We keep minimum 0.08 so that the
                         * anatomical pathway doesn't vanish.
                         */

                        const connectionStrength =

                            THREE.MathUtils.clamp(

                                (1 - disease) *

                                (0.3 + activity * 0.7),

                                0.05,

                                1

                            );

                        // ----------------------------------
                        // Biological signal colour
                        // ----------------------------------

                        const signalColor =
                            getSignalColor(
                                sourceState.name
                            );

                        // ==================================
                        // CHIP STIMULATION
                        // ==================================

                        /*
                         * Chip signals should currently
                         * appear only around regions reached
                         * by BrainChipEngine.
                         */

                        const chipStimulated =
                            brainSignalPropagation.isConnectionActive(
                                source,
                                target
                            );
                        // ==================================
                        // Render pathway
                        // ==================================

                        // ==================================
                        // BIOLOGICAL SIGNAL SPEED
                        // ==================================

                        const infected =
                            sourceState.infected ||
                            targetState.infected;

                        let biologicalSpeed = 0.4;

                        if (infected) {
                            biologicalSpeed = 0.12;
                        }

                        const showBiologicalSignal =
                            !brainEngine.isChipActive() &&
                            activity > 0.45 &&
                            connectionStrength > 0.30;

                        return (

                            <React.Fragment
                                key={
                                    `${source}-${target}`
                                }
                            >

                                {/* =========================
                                    CONNECTION LINE
                                   ========================= */}

                                <BrainConnection

                                    start={
                                        start
                                    }

                                    end={
                                        end
                                    }

                                    weight={
                                        Math.min(
                                            connection.weight / 8,
                                            1
                                        )
                                    }

                                    activity={
                                        activity
                                    }

                                    connectionStrength={
                                        connectionStrength
                                    }

                                />


                                {/* =========================
                                    BIOLOGICAL SIGNAL
                                   ========================= */}

                                {
                                    showBiologicalSignal && (

                                        <BrainSignal

                                            source={source}

                                            target={target}

                                            start={start}

                                            end={end}

                                            speed={biologicalSpeed}

                                            color={signalColor}

                                            type="biological"

                                        />

                                    )
                                }

                                


                                {/* =========================
                                    CHIP SIGNAL
                                   ========================= */}

                                {

                                    brainEngine
                                        .isChipActive() &&

                                    chipStimulated && (

                                        <BrainSignal

                                            source={
                                                source
                                            }

                                            target={
                                                target
                                            }

                                            start={
                                                start
                                            }

                                            end={
                                                end
                                            }

                                            color="#00FFFF"

                                            type="chip"

                                        />

                                    )

                                }

                            </React.Fragment>

                        );

                    })

            }

        </>

    );

}