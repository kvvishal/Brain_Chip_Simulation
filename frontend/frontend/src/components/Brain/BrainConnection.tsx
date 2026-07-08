"use client";

import * as THREE from "three";
import { useMemo } from "react";

type Props = {
    start: THREE.Vector3;
    end: THREE.Vector3;
    weight: number;
    activity: number;
};

export default function BrainConnection({
    start,
    end,
    weight,
    activity
}: Props) {

    const points = useMemo(() => [start, end], [start, end]);

    const geometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [points]);
    return (
        <line geometry={geometry}>
            <lineBasicMaterial
            attach="material"
            color="#7DEBFF"
            transparent={true}
            opacity={0.05 + activity * 0.35}
            depthWrite={false}
        />
        </line>
    );
}