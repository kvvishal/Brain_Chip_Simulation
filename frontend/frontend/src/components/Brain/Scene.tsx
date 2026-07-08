import { OrbitControls } from "@react-three/drei";
import { useMemo } from "react";
import { BoxGeometry } from "three";

export default function Scene() {
  const geometry = useMemo(() => new BoxGeometry(2, 2, 2), []);

  return (
    <>
      <ambientLight intensity={3} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={5}
      />

      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshNormalMaterial />
      </mesh>

      <OrbitControls />
    </>
  );
}