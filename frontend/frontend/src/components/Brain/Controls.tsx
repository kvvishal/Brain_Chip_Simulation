"use client";

import { OrbitControls } from "@react-three/drei";

export default function Controls() {
  return (
    <OrbitControls
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
    />
  );
}