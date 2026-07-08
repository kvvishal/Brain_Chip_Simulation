"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BrainRoot from "./BrainRoot";
import BrainModel from "./BrainModel";
import BrainRegions from "./BrainRegions";
import Brain from "./Brain";
import { Color} from "three";

export default function BrainCanvas() {

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}
    onCreated={({scene}) => {
      scene.background = new Color("#050816");
    }}
    >

    <ambientLight intensity={2} />

    <directionalLight position={[5,5,5]} intensity={2}/>

    <BrainRoot/>

    <OrbitControls
        makeDefault
        enableRotate={true}
        enableZoom={true}
        enablePan={false}
    />

</Canvas>

  );

}