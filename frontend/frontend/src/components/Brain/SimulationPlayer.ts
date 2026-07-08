"use client";

import { getSimulation } from "@/api/simulationAPI";
import { brainEngine } from "./BrainEngine";

class SimulationPlayer {

    private frames:number[][]=[];

    private frame=0;

    private playing=false;

    async initialize(){

        const data=await getSimulation();

        this.frames=data.frames;

        console.log(

            "Loaded",

            this.frames.length,

            "frames"

        );

    }

    play(){

        if(this.playing) return;

        this.playing=true;

    }

    pause(){

        this.playing=false;

    }

    update(){

        if(!this.playing) return;

        if(this.frames.length==0) return;

        brainEngine.setFrame(

            this.frames[this.frame]

        );

        this.frame++;

        if(this.frame>=this.frames.length)

            this.frame=0;

    }

    restart(){

        this.frame=0;

    }

}

export const simulationPlayer=new SimulationPlayer();