"use client";

import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface Props {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
}

export default function SignalPulse({
  start,
  end,
  speed = 0.4,
}: Props) {

  const ref = useRef<THREE.Mesh>(null);

  const progress = useRef(Math.random());

  useFrame((_, delta) => {

    progress.current += delta * speed;

    if (progress.current > 1)
      progress.current = 0;

    const x =
      start[0] + (end[0] - start[0]) * progress.current;

    const y =
      start[1] + (end[1] - start[1]) * progress.current;

    const z =
      start[2] + (end[2] - start[2]) * progress.current;

    ref.current?.position.set(x, y, z);

  });

  return (
    <Sphere ref={ref} args={[0.08, 16, 16]}>

      <meshStandardMaterial

        color="#ffff00"

        emissive="#ffff00"

        emissiveIntensity={4}

      />

    </Sphere>
  );

}