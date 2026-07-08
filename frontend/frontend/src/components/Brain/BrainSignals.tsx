"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";

import {
  BrainRegion,
  BrainConnection,
  loadRegions,
  loadStrongConnections,
} from "./brainData";

export default function BrainSignals() {

  const [regions, setRegions] = useState<BrainRegion[]>([]);
  const [connections, setConnections] = useState<BrainConnection[]>([]);
  const [time, setTime] = useState(0);

  useEffect(() => {

    loadRegions().then(setRegions);
    loadStrongConnections(0.65).then(setConnections);

  }, []);

  useEffect(() => {

    let animationFrame: number;

    const animate = () => {
      setTime(performance.now() * 0.001);
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrame);

  }, []);

  const regionMap = useMemo(() => {
    const map = new Map<number, BrainRegion>();

    regions.forEach((r) => map.set(r.id, r));

    return map;
  }, [regions]);

  return (
    <>
      {connections.slice(0, 150).map((connection, index) => {

        const source = regionMap.get(connection.source);
        const target = regionMap.get(connection.target);

        if (!source || !target) return null;

        const t = (time * 0.3 + index * 0.01) % 1;

        const start = new THREE.Vector3(
          source.position[0] * 30,
          source.position[2] * 30,
          -source.position[1] * 30
        );

        const end = new THREE.Vector3(
          target.position[0] * 30,
          target.position[2] * 30,
          -target.position[1] * 30
        );

        const position = start.clone().lerp(end, t);

        return (
          <mesh
            key={index}
            position={position}
          >
            <sphereGeometry args={[0.6, 12, 12]} />

            <meshBasicMaterial
              color="#00ffff"
            />
          </mesh>
        );
      })}
    </>
  );
}