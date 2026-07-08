"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

import BrainConnection from "./BrainConnection";
import { loadConnections } from "@/api/brainConnectionAPI";
import { loadRegions } from "@/api/brainAPI";
import { coordinateTransformer } from "./CoordinateTransformer";
import { brainPositionStore } from "./BrainPositionStore";
import { brainEngine } from "./BrainEngine";

type Connection = {
    source: number;
    target: number;
    weight: number;
};

export default function BrainConnections() {

    const [connections, setConnections] = useState<Connection[]>([]);
    const [regions, setRegions] = useState<any[]>([]);
    const points = brainPositionStore.get();

    useEffect(() => {

        Promise.all([

            loadConnections(),
            loadRegions()

        ]).then(([connectionData, regionData]) => {

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
                    .sort((a,b) => b.weight - a.weight)
                    .slice(0, 300)
                    .map((c, index) =>{
                    const start = points[c.source];
                    const end = points[c.target];
                    const activity = (
                        brainEngine.getActivity(c.source) +
                        brainEngine.getActivity(c.target)
                    ) / 2;

                    if (!start || !end) return null;
                    
                    console.log(
                        c.source,
                        c.target,
                        start.toArray(),
                        end.toArray()
                    );

                    return (

                        <BrainConnection

                            key={index}

                            start={start}

                            end={end}

                            weight={Math.min(c.weight / 5, 0.25)}

                            activity = {activity}

                        />

                    );

                })

            }

        </>

    );

}