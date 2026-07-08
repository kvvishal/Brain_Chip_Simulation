import { BrainRegionState } from "./BrainRegionState";
import { BrainEvent } from "./BrainEvent";

class BrainEngine {

    private activity: number[] = [];

    private health: number[] = [];

    private infected: boolean[] = [];

    private stimulated: boolean[] = [];

    private names: string[] = [];

    private frame:number[] = [];

    private regions: BrainRegionState[] = [];

    // -----------------------------
    // Initialize Brain
    // -----------------------------
    initialize(regions: any[]) {

        const count = regions.length;

        this.activity = new Array(count).fill(0.8);

        this.health = new Array(count).fill(1.0);

        this.infected = new Array(count).fill(false);

        this.stimulated = new Array(count).fill(false);

        this.names = regions.map(r => r.name);

        this.regions = [];

        for (let i = 0; i < this.names.length; i++) {

            this.regions.push({

                id: i,

                name: this.names[i],

                activity: 0,

                health: 1,

                disease: 0,

                stimulation: 0,

                connectionStrength: 1,

                infected: false,

                stimulated: false

            });

        }

        console.log("Brain Engine Initialized");
        console.log("Regions:", count);
    }

    // -----------------------------
    // Getters
    // -----------------------------

    getActivity(index: number) {

        return this.activity[index] ?? 0;

    }

    getHealth(index: number) {

        return this.health[index] ?? 0;

    }

    isInfected(index: number) {

        return this.infected[index];

    }

    isStimulated(index: number) {

        return this.stimulated[index];

    }

    getRegionName(index: number) {

        return this.names[index];

    }

    getRegionCount(): number {

        return this.activity.length;
    }

    getRegion(index : number) : BrainRegionState{

        return this.regions[index];
    }

    // -----------------------------
    // Healthy Brain
    // -----------------------------

    setHealthy() {

        for (let i = 0; i < this.activity.length; i++) {

            this.activity[i] = 1;

            this.health[i] = 1.0;

            this.infected[i] = false;

            this.stimulated[i] = false;

        }

        console.log("Healthy Brain Loaded");

    }

    // -----------------------------
    // Alzheimer's Disease
    // -----------------------------

    setAlzheimer() {

        for (let i = 0; i < this.activity.length; i++) {

            const name = this.names[i];

            if (

                name.includes("Hipp") ||

                name.includes("PHC") ||

                name.includes("Amyg") ||

                name.includes("TC")

            ) {

                this.activity[i] = 0.25;

                this.health[i] = 0.35;

                this.infected[i] = true;

            }

        }

        console.log("Alzheimer Mode Activated");

        }

    setActivity(index:number,value:number){

        this.activity[index]=value;

    }

    setHealth(index:number,value:number){

        this.health[index]=value;

    }

    // -----------------------------

    setFrame(activity:number[]) {

        this.frame = activity;

        this.regions.forEach((region,index)=>{

            const value = activity[index];

            region.activity = Math.max(

                0,

                Math.min(

                    1,

                    (value+2)/6

                )

            );

             region.health = Math.max(0, Math.min(1, region.health));

            region.disease = Math.max(0, Math.min(1, region.disease));

            region.stimulation = Math.max(0, Math.min(1, region.stimulation));

            region.connectionStrength = Math.max(
                0,
                Math.min(1, region.connectionStrength)
            );

        });

    }

    // -----------------------------
    // Brain Chip
    // -----------------------------

    activateChip() {

        for (let i = 0; i < this.activity.length; i++) {

            if (this.infected[i]) {

                this.stimulated[i] = true;

            }

        }

        console.log("Brain Chip Activated");

    }

    // -----------------------------
    // Simulation Update
    // -----------------------------

    update() {

        for (let i = 0; i < this.activity.length; i++) {

    if (!this.infected[i]) {

        const noise = (Math.random() - 0.5) * 0.01;

        this.activity[i] += noise;

    }

    if (this.stimulated[i]) {

        this.activity[i] += 0.0015;

        this.health[i] += 0.001;

    }

    this.activity[i] = Math.max(
        0,
        Math.min(1, this.activity[i])
    );

    this.health[i] = Math.max(
        0,
        Math.min(1, this.health[i])
    );

}

    }

    applyEvent(event:BrainEvent){

    const r=this.getRegion(event.region);

    r.activity+=event.activityDelta;

    r.health+=event.healthDelta;

    r.disease+=event.diseaseDelta;

    r.stimulation+=event.stimulationDelta;

    r.activity=Math.max(0,Math.min(1,r.activity));

    r.health=Math.max(0,Math.min(1,r.health));

    r.disease=Math.max(0,Math.min(1,r.disease));

    r.stimulation=Math.max(0,Math.min(1,r.stimulation));

}

}

export const brainEngine = new BrainEngine();