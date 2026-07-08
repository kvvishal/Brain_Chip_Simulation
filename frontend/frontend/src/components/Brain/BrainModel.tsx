"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

import { loadRegions } from "@/api/brainAPI";
import { coordinateTransformer } from "./CoordinateTransformer";
import { BRAIN_SCALE, BRAIN_OFFSET } from "./BrainConstants";

export default function BrainModel() {

    const { scene } = useGLTF("/models/brain1.glb");

    useEffect(() => {

        scene.scale.setScalar(0.027);
        scene.position.set(0, -1, 0);

        scene.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(scene);

        loadRegions().then((data) => {

            const atlas = data.regions.map((r: any) =>

                new THREE.Vector3(

                    r.position[0],
                    r.position[1],
                    r.position[2]

                )

            );

            coordinateTransformer.initialize(
                atlas,
                box
            );

            console.log("Transformer Ready");

        });

    }, [scene]);

    return <primitive 
            object={scene} 
            scale = {0.027}  
            position={BRAIN_OFFSET}
    />

}

useGLTF.preload("/models/brain1.glb");