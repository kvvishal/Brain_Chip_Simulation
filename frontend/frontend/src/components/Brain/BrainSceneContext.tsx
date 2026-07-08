"use client";

import { createContext, useContext, useState } from "react";
import * as THREE from "three";

type SceneContextType = {
    modelBox: THREE.Box3 | null;
    setModelBox: (box: THREE.Box3) => void;
};

const SceneContext = createContext<SceneContextType | null>(null);

export function BrainSceneProvider({ children }: any) {

    const [modelBox, setModelBox] = useState<THREE.Box3 | null>(null);

    return (
        <SceneContext.Provider value={{ modelBox, setModelBox }}>
            {children}
        </SceneContext.Provider>
    );
}

export function useScene() {

    const ctx = useContext(SceneContext);

    if (!ctx) throw new Error("BrainSceneProvider missing");

    return ctx;
}