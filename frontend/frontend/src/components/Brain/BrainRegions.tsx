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
import { stat } from "fs";

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

            brainEngine.initialize(data.regions);

            setRegions(data.regions);

            setReady(true);
        
        });

    }, []);

    if (!ready || !coordinateTransformer.isReady()) {

        return null;

    }

    regions.map((r) => {

        const state = brainEngine.getRegions()[r.id];

        if (!state) return null;

        let color = getRegionColor(r.name);

        if (state.disease > 0.75) {

            color = "#ff0000";

        }
        else if (state.disease > 0.50) {

            color = "#ff8800";

        }
        else if (state.disease > 0.25) {

            color = "#ffff00";

        }
        
        console.log("BrainEngine:", brainEngine.getRegionCount());
        
        return (

            <BrainRegion

                key={r.id}

                position={brainPositionStore.get()[r.id]}

                activity={state.activity}

                color={color}

                health={state.health}

            />

        );
        

})}