"use client";

export default function BrainLights() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={3}
      />

      <pointLight
        position={[-5, 3, 5]}
        intensity={2}
      />

      <spotLight
        position={[0, 10, 5]}
        angle={0.4}
        intensity={3}
      />
    </>
  );
}