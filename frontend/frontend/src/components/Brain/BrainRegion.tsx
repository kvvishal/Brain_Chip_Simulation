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

        // =====================================
        // Size
        // =====================================

        /*
         * Healthy regions:
         *      slightly larger
         *
         * Diseased regions:
         *      shrink gradually
         *
         * Active regions:
         *      pulse naturally
         */

        const pulse =
            1 +
            Math.sin(
                performance.now() * 0.003 +
                position.x
            ) * 0.08;

        const size =
            (0.45 + health * 0.55) *
            (0.75 + activity * 0.25) *
            pulse;

        meshRef.current.scale.lerp(

            new THREE.Vector3(
                size,
                size,
                size
            ),

            0.15

        );

        // =====================================
        // Transparency
        // =====================================

        material.transparent = true;

        material.opacity =
            THREE.MathUtils.lerp(
                material.opacity,
                0.25 + health * 0.75,
                0.15
            );

        // =====================================
        // Color
        // =====================================

        const base =
            new THREE.Color(color);

        const disease =
            new THREE.Color("#ff3030");

        base.lerp(
            disease,
            1 - health
        );

        material.color.copy(base);

        // =====================================
        // Emission
        // =====================================

        if (stimulated) {

            material.emissive.set("#00ffff");

            material.emissiveIntensity = 4;

        } else {

            material.emissive.copy(base);

            material.emissiveIntensity =
                0.15 +
                activity * 1.6 +
                health * 0.5;

        }

    });

    return (

        <mesh
            ref={meshRef}
            position={position}
            renderOrder={10}
        >

            <sphereGeometry
                args={[0.035, 20, 20]}
            />

            <meshStandardMaterial
                color={color}
                emissive={color}
                metalness={0.55}
                roughness={0.4}
                toneMapped={false}
            />

        </mesh>

    );

}