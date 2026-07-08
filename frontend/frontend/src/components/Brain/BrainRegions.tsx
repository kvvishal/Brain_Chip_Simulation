"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

import BrainRegion from "./BrainRegion";
import { loadRegions } from "@/api/brainAPI";
import { coordinateTransformer } from "./CoordinateTransformer";
import { BRAIN_OFFSET, BRAIN_SCALE } from "./BrainConstants";
import { brainPositionStore } from "./BrainPositionStore";
import { brainEngine } from "./BrainEngine";
import { useBrain } from "../Brain/BrainContext";

function getRegionColor(name: string) {

    if (name.includes("PFC")) return "#00BFFF";      // Frontal
    if (name.includes("MFC")) return "#00BFFF";

    if (name.includes("PC")) return "#00FF7F";       // Parietal
    if (name.includes("SPL")) return "#00FF7F";

    if (name.includes("TC")) return "#FF00FF";       // Temporal

    if (name.includes("OC")) return "#FFD700";       // Occipital

    if (name.includes("Amyg")) return "#FF4040";     // Amygdala

    if (name.includes("PHC")) return "#FF4040";      // Parahippocampal

    if (name.includes("Hipp")) return "#FF4040";     // Hippocampus

    if (name.includes("Cb")) return "#00FFFF";       // Cerebellum

    return "#66CCFF";                               // Default
}

export default function BrainRegions() {
    const { version } = useBrain();
    void version;

    const [regions, setRegions] = useState<any[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {

        loadRegions().then((data) => {

            const transformed = data.regions.map((r:any) =>
                coordinateTransformer.transform(
                    new THREE.Vector3(
                        r.position[0],
                        r.position[1],
                        r.position[2]
                    )
                )
            
            );

            brainPositionStore.set(transformed);

            setRegions(data.regions);

            brainEngine.initialize(data.regions);

            setReady(true);

        });

    }, []);

    if (!ready || !coordinateTransformer.isReady()) {

        return null;

    }

    return (

        <>

            {regions.map((r) => (

            <BrainRegion

                key={r.id}

                position = {brainPositionStore.get()[r.id]}

                activity={brainEngine.getActivity(r.id)}

                color={getRegionColor(r.name)}

                health={brainEngine.getHealth(r.id)}

            />

            ))}

        </>

    );

}