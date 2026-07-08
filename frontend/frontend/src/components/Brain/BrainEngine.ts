class BrainEngine {

    private activity: number[] = [];

    private health: number[] = [];

    private infected: boolean[] = [];

    private stimulated: boolean[] = [];

    private names: string[] = [];

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

}

export const brainEngine = new BrainEngine();