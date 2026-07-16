"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type BrainRegionProps = {

    position: THREE.Vector3;

    activity: number;

    color: string;

    health: number;

    stimulated: boolean;

};

export default function BrainRegion({

    position,

    activity,

    color,

    health,

    stimulated

}: BrainRegionProps) {

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {

        if (!meshRef.current) return;

        const material =
            meshRef.current.material as THREE.MeshStandardMaterial;

        // Smooth breathing animation
        const pulse =
            0.7 +
            Math.sin(Date.now() * 0.003 + position.x) * 0.08 +
            activity * 0.25;

        meshRef.current.scale.setScalar(

            pulse * health

        );

        material.transparent = true;

        material.opacity = Math.max(0.35, health);

        if (stimulated) {

            material.emissive.set("#00ffff");

            material.emissiveIntensity = 4;

        } else {

            material.emissive.set(color);

            material.emissiveIntensity =
                0.3 + activity * 1.5;

        }

    });

    return (

        <mesh
            position={position}
            ref={meshRef}
            renderOrder={10}
        >

            <sphereGeometry args={[0.035, 20, 20]} />

            <meshStandardMaterial

                color={color}

                emissive={color}

                metalness={0.65}

                emissiveIntensity={2}

                toneMapped={false}

            />

        </mesh>

    );

}