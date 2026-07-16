"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type Props = {
    source: number;
    target: number;
    start: THREE.Vector3;
    end: THREE.Vector3;
    speed?: number;
    color: string;
};

export default function BrainSignal({

    source,

    target,

    start,

    end,

    speed = 0.4,

    color

}: Props) {

    const mesh = useRef<THREE.Mesh>(null);

    // Each signal starts at a different position
    const offset = useRef(Math.random());

    useFrame(({ clock }) => {

        if (!mesh.current) return;

        const t =
            (clock.elapsedTime * speed + offset.current) % 1;

        mesh.current.position.lerpVectors(
            start,
            end,
            t
        );

        const scale =
            1 + Math.sin(clock.elapsedTime * 20) * 0.3;

        mesh.current.scale.setScalar(scale);

    });

    return (

        <mesh
            ref={mesh}
            renderOrder={15}
        >

            <sphereGeometry args={[0.018, 12, 12]} />

            <meshBasicMaterial

                color={color}

                toneMapped={false}

                transparent

                opacity={0.9}

            />

        </mesh>

    );

}