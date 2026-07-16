
"use client";

import React, { useEffect, useState } from "react";
import * as THREE from "three";

import BrainConnection from "./BrainConnection";
import { loadConnections } from "@/api/brainConnectionAPI";
import { loadRegions } from "@/api/brainAPI";
import { coordinateTransformer } from "./CoordinateTransformer";
import { brainPositionStore } from "./BrainPositionStore";
import { brainEngine } from "./BrainEngine";
import { brainChipEngine } from "./BrainChipEngine";
import BrainSignal from "./BrainSignals";
import { brainGraph } from "./BrainGraph";

type Connection = {
    source: number;
    target: number;
    weight: number;
};

function getSignalColor(name: string) {

    if (name.includes("PFC")) return "#00BFFF";      // Blue
    if (name.includes("MFC")) return "#00BFFF";

    if (name.includes("PC")) return "#00FF7F";       // Green
    if (name.includes("SPL")) return "#00FF7F";

    if (name.includes("TC")) return "#FF00FF";       // Purple

    if (name.includes("OC")) return "#FFD700";       // Yellow

    if (name.includes("Amyg")) return "#FF4040";     // Red
    if (name.includes("PHC")) return "#FF4040";
    if (name.includes("Hipp")) return "#FF4040";

    if (name.includes("Cb")) return "#00FFFF";       // Cerebellum

    return "#FFFFFF";

}

export default function BrainConnections() {

    const [connections, setConnections] = useState<Connection[]>([]);
    const [regions, setRegions] = useState<any[]>([]);
    const points = brainPositionStore.get();

    useEffect(() => {

        Promise.all([

            loadConnections(),
            loadRegions()

        ]).then(([connectionData, regionData]) => {

            brainGraph.initialize(connectionData);
            setConnections(connectionData);
            setRegions(regionData.regions);

            console.log("Connections:", connectionData.length);
            console.log("Regions:", regionData.regions.length);

        });

    }, []);

    if (!coordinateTransformer.isReady()) {

        return null;

    }

    
    return (

        <>

            {

                connections
    .filter(c => c.weight >= 2)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 300)
    .map((c) => {

        const start = points[c.source];
        const end = points[c.target];

        if (!start || !end)
            return null;

        const activity =
            (
                brainEngine.getActivity(c.source) +
                brainEngine.getActivity(c.target)
            ) / 2;

        const signalColor =
            getSignalColor(
                brainEngine.getRegionName(c.source)
            );

        const disease = Math.max(
            brainEngine.getRegion(c.source).disease,
            brainEngine.getRegion(c.target).disease
        );

        const connectionStrength = 1 - disease;

        console.log(
            c.source,
            c.target,
            disease,
            connectionStrength
        );

        let signalSpeed = 0.4;

        //--------------------------------------------------
        // Alzheimer's
        //--------------------------------------------------

        const infected =
            brainEngine.isInfected(c.source) ||
            brainEngine.isInfected(c.target);

        // Stable blocked pathways (no flickering)
        const blocked =
            infected &&
            ((c.source + c.target) % 3 === 0);

        if (blocked)
            return null;

        if (infected)
            signalSpeed = 0.15;

        //--------------------------------------------------
        // Chip stimulation
        //--------------------------------------------------

        const chipStimulated =
            brainChipEngine.isRegionActive(c.source) ||
            brainChipEngine.isRegionActive(c.target);

        return (

            <React.Fragment
                key={`${c.source}-${c.target}`}
            >

                <BrainConnection

                    start={start}

                    end={end}

                    weight={Math.min(c.weight / 5, 0.25)}

                    activity={activity}

                    connectionStrength={connectionStrength}

                />

                {/* Biological signal */}

                <BrainSignal

                    source={c.source}

                    target={c.target}

                    start={start}

                    end={end}

                    speed={signalSpeed}

                    color={signalColor}

                />

                {/* Chip repair signal */}

                {brainEngine.isChipActive() &&
                    chipStimulated && (

                    <BrainSignal

                        source={c.source}

                        target={c.target}

                        start={start}

                        end={end}

                        speed={0.7}

                        color="#00FFFF"

                    />

                )}

            </React.Fragment>

        );

    })

            }

        </>

    );

}