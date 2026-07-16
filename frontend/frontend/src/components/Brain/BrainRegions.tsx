"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

import BrainRegion from "./BrainRegion";
import { loadRegions } from "@/api/brainAPI";
import { coordinateTransformer } from "./CoordinateTransformer";
import { brainPositionStore } from "./BrainPositionStore";
import { brainEngine } from "./BrainEngine";
import { useBrain } from "../Brain/BrainContext";

function getRegionColor(
    name: string,
    health: number,
    infected: boolean
) {
    // Disease colours
    if (infected && health < 0.35) return "#ff3030";
    if (health < 0.60) return "#ff9900";
    if (health < 0.90) return "#7CFC00";

    // Anatomical colours
    if (name.includes("PFC")) return "#00BFFF";
    if (name.includes("MFC")) return "#00BFFF";

    if (name.includes("PC")) return "#00FF7F";
    if (name.includes("SPL")) return "#00FF7F";

    if (name.includes("TC")) return "#FF00FF";

    if (name.includes("OC")) return "#FFD700";

    if (name.includes("Amyg")) return "#FF4040";
    if (name.includes("PHC")) return "#FF4040";
    if (name.includes("Hipp")) return "#FF4040";

    if (name.includes("Cb")) return "#00FFFF";

    return "#66CCFF";
}

export default function BrainRegions() {

    const { version } = useBrain();
    void version;

    const [regions, setRegions] = useState<any[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {

        loadRegions().then((data) => {

            const transformed = data.regions.map((r: any) =>
                coordinateTransformer.transform(
                    new THREE.Vector3(
                        r.position[0],
                        r.position[1],
                        r.position[2]
                    )
                )
            );

            brainPositionStore.set(transformed);

            brainEngine.initialize(data.regions);

            console.log(
                "Brain initialized:",
                brainEngine.getRegionCount()
            );

            setRegions(data.regions);

            setReady(true);

        });

    }, []);

    if (!ready || !coordinateTransformer.isReady()) {

        return null;

    }

    return (

        <>

            {regions.map((r) => {

                const state = brainEngine.getRegion(r.id);

                let color = getRegionColor(
                    r.name,
                    state.health,
                    state.infected
                );

                if (state.disease > 0.75) {

                    color = "#ff0000";

                } else if (state.disease > 0.50) {

                    color = "#ff8800";

                } else if (state.disease > 0.25) {

                    color = "#ffff00";

                }

                return (

                    <BrainRegion

                        key={r.id}

                        position={brainPositionStore.get()[r.id]}

                        activity={state.activity}

                        color={color}

                        stimulated={state.stimulated}

                        health={state.health}

                    />

                );

            })}

        </>

    );

}