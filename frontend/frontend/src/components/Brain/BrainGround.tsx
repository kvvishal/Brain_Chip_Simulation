"use client";

export default function BrainGround() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -3,0]}
    >
      <circleGeometry args={[6, 64]} />

      <meshStandardMaterial
        color="#101828"
      />
    </mesh>
  );
}