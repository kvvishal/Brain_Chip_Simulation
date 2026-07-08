"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type Props = {
    start: THREE.Vector3;
    end: THREE.Vector3;
    speed?: number;
};

export default function BrainSignal({

    start,

    end,

    speed = 0.4

}: Props) {

    const mesh = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {

        if (!mesh.current) return;

        const t = (clock.elapsedTime * speed) % 1;

        mesh.current.position.lerpVectors(

            start,

            end,

            t

        );

    });

    return (

        <mesh ref={mesh}>

            <sphereGeometry args={[0.018, 12, 12]} />

            <meshBasicMaterial

                color="#00ffff"

                toneMapped={false}

            />

        </mesh>

    );

}