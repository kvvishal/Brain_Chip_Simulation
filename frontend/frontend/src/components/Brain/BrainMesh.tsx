"use client";

export default function BrainMesh() {
  return (
    <mesh>

        <sphereGeometry args={[1.5,64,64]} />

        <meshStandardMaterial
            color="pink"
        />

    </mesh>
  );
}