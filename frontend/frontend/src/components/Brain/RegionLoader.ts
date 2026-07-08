"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { sampleBrainSurface } from "./BrainSurfaceSampler";

interface Props {
    onLoaded: (points: THREE.Vector3[]) => void;
}

import * as THREE from "three";

export default function RegionLoader({ onLoaded }: Props) {

    const { scene } = useGLTF("/models/.glb");

    useEffect(() => {

        const points = sampleBrainSurface(scene, 96);

        onLoaded(points);

    }, [scene]);

    return null;

}