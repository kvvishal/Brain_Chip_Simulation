"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { brainEngine } from "./BrainEngine";

export default function BrainChip() {

    const chipRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {

        if (!chipRef.current) return;

        if (!brainEngine.isChipActive()) return;

        const t = clock.getElapsedTime();

        // Gentle breathing animation
        const scale = 1 + Math.sin(t * 3) * 0.08;

        chipRef.current.scale.setScalar(scale);

        const material =
            chipRef.current.material as THREE.MeshPhysicalMaterial;

        // Pulsing glow
        material.emissiveIntensity =
            1.8 + Math.sin(t * 5) * 0.6;

    });

    // if (!brainEngine.isChipActive()) return null; 

    return (

        <mesh

            ref={chipRef}

            position={[0.3, -0.3, 0]}

            rotation={[0.4, 0.8, 0.1]}

        >

            {/* Chip Body */}
            <boxGeometry

               args={[0.08, 0.025, 0.008]}

            />

            <mesh scale={1.5}>

                <sphereGeometry args={[0.08,16,16]} />

                <meshBasicMaterial
                    color="#00ffff"
                    transparent
                    opacity={0.12}
                />

            </mesh>
            

            <meshPhysicalMaterial
                color="#1e90ff"
                emissive="#00ffff"
                emissiveIntensity={2}
                metalness={0.9}
                roughness={0.15}
                clearcoat={1}
                transparent
                opacity={0.9}
            />

        </mesh>

    );

}