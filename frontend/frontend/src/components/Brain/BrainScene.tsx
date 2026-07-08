"use client";

import BrainModel from "./BrainModel";
import BrainLights from "./BrainLights";
import BrainGround from "./BrainGround";

export default function BrainScene() {
  return (
    <>
      <BrainLights />

      <BrainGround />

      <BrainModel />
    </>
  );
}