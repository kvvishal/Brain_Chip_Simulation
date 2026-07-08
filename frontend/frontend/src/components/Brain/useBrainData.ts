"use client";

import { useEffect, useState } from "react";

interface BrainData {
    label: string[];
    center: number[][];
    weight: number[][];
    tract_length: number[][];
}

export default function useBrainData() {

    const [brain,setBrain]=useState<BrainData | null>(null);

    useEffect(()=>{

        fetch("/data/brain_data.json")

        .then(r=>r.json())

        .then(data=>setBrain(data));

    },[]);

    return brain;

}