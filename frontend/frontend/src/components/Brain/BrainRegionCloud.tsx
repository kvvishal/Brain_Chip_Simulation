"use client";

import BrainRegion from "./BrainRegion";
import * as THREE from "three";

interface Props {

  points: THREE.Vector3[];

  activity: number[];

}

export default function BrainRegionCloud({

  points,

  activity,

}: Props) {

  return (

    <>

      {points.map((p, i) => (

        <BrainRegion

          key={i}

          position={p}

          activity={activity[i] ?? 0}

        />

      ))}

    </>

  );

}