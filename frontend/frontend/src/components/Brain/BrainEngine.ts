import { BrainRegionState } from "./BrainRegionState";
import { BrainEvent } from "./BrainEvent";

class BrainEngine {

    private names: string[] = [];

    private frame:number[] = [];

    private regions: BrainRegionState[] = [];

    // -----------------------------
    // Initialize Brain
    // -----------------------------
    initialize(regions: any[]) {

        const count = regions.length;

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

    if (!this.regions[index]) {

        return 0;

    }

    return this.regions[index].activity;

}

    getHealth(index: number) {

    if (!this.regions[index]) {

        return 1;

    }

    return this.regions[index].health;

}

    isInfected(index: number) {

        return this.regions[index]?.infected ?? false;

    }

    isStimulated(index: number) {

        return this.regions[index]?.stimulated ?? false;

    }

    getRegionName(index: number) {

        return this.names[index];

    }

    getRegionCount(): number {

        return this.regions.length;
    }

    getRegion(index: number): BrainRegionState {

    if (!this.regions[index]) {

        throw new Error(`Region ${index} not initialized`);

    }

    return this.regions[index];

    }

    getRegions(){
        return this.regions;
    }

    // -----------------------------
    // Healthy Brain
    // -----------------------------

    setHealthy() {

    this.regions.forEach(region => {

        region.activity = 1;

        region.health = 1;

        region.disease = 0;

        region.stimulation = 0;

        region.connectionStrength = 1;

        region.infected = false;

        region.stimulated = false;

    });

    console.log("Healthy Brain Loaded");

    }

    // -----------------------------
    // Alzheimer's Disease
    // -----------------------------

    setAlzheimer() {

    this.regions.forEach(region => {

        if (

            region.name.includes("Hipp") ||

            region.name.includes("PHC") ||

            region.name.includes("Amyg") ||

            region.name.includes("TC")

        ) {

            region.activity = 0.35;

            region.health = 0.45;

            region.disease = 0.65;

            region.infected = true;

        }

    });

    console.log("Alzheimer Mode Activated");

    }

    // -----------------------------

    setFrame(activity:number[]) {

        this.frame = activity;

        this.regions.forEach((region,index)=>{

            const value = activity[index] ?? 0;

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

        this.regions.forEach(region => {

            if(region.infected){

                region.stimulated = true;

                region.stimulation = 1;

            }

    });

    console.log("Brain Chip Activated");

    }

    // -----------------------------
    // Simulation Update
    // -----------------------------

    update() {

    this.regions.forEach(region => {

        if(!region.infected){

            region.activity +=

                (Math.random()-0.5)*0.01;

        }

        if(region.stimulated){

            region.activity += 0.0015;

            region.health += 0.001;

        }

        region.activity=Math.max(

            0,

            Math.min(1,region.activity)

        );

        region.health=Math.max(

            0,

            Math.min(1,region.health)

        );

    });

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