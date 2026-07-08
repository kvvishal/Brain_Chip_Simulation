"use client";

import { useBrainStore } from "./brainStore";
import useBrainData from "./useBrainData";

export default function BrainHUD() {

    const brain = useBrainData();

    const { selected } = useBrainStore();

    if(selected===null || !brain)
        return null;

    return(

<div className="absolute top-6 right-6 bg-black/70 backdrop-blur-lg p-5 rounded-xl w-72">

<h2 className="text-2xl">

{brain.labels[selected]}

</h2>

<p>

Activity

0.84

</p>

<p>

Healthy

</p>

</div>

);

}