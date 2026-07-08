"use client";

import useBrainData from "./useBrainData";
import { Html } from "@react-three/drei";
import { useState } from "react";
import { useBrainStore } from "./brainStore";
import { activityColor } from "@/simulation/ActivityEngine";
import useActivity from "@/hooks/useBrainActivity";

export default function BrainNodes() {

  const brain = useBrainData();

  const [hovered, setHovered] = useState<number | null>(null);

  const activity = useActivity();

  if (!brain) return null;

  return (
    <>
      {brain.centres.map((centre: number[], index: number) => (

        <mesh
          key={index}
          position={[centre[0], centre[1], centre[2]]}
          onPointerOver={() => setHovered(index)}
          onPointerOut={() => setHovered(null)}
          onClick={() => useBrainStore.getState().setSelected(index)}
        >

          <sphereGeometry args={[0.35, 20, 20]} />

          <meshStandardMaterial
            color={activityColor(activity[index])}
            emissive={activityColor(activity[index])}
            emissiveIntensity={1.5}
        />

          {hovered === index && (
            <Html distanceFactor={10}>
              <div
                style={{
                  background: "rgba(0,0,0,0.8)",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                {brain.labels[index]}
              </div>
            </Html>
          )}

        </mesh>

      ))}
    </>
  );
}