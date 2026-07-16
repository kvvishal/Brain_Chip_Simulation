"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { brainEngine } from "./BrainEngine";
import { brainChipEngine } from "./BrainChipEngine";

export default function BrainPulse() {

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {

        if (!meshRef.current) return;

        if (!brainEngine.isChipActive()) {

            meshRef.current.visible = false;

            brainChipEngine.setStimulationRadius(0);

            return;

        }

        meshRef.current.visible = true;

        const material =
            meshRef.current.material as THREE.MeshBasicMaterial;

        // Pulse repeats every second
        const cycle = clock.getElapsedTime() % 1;

        // Visual pulse radius
        const radius = 0.15 + cycle * 0.45;

        meshRef.current.scale.setScalar(radius * 10);

        // Synchronize simulation with pulse
        brainChipEngine.setStimulationRadius(radius);

        // Fade pulse
        material.opacity = 0.45 * (1 - cycle);

    });

    return (

        <mesh

            ref={meshRef}

            position={brainChipEngine.getChipPosition()}

            renderOrder={20}

        >

            <sphereGeometry args={[0.05, 32, 32]} />

            <meshBasicMaterial

                color="#00FFFF"

                transparent

                opacity={0.45}

                wireframe

                depthWrite={false}

                toneMapped={false}

            />

        </mesh>

    );

}