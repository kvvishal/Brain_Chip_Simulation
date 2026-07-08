import { brainEngine } from "./BrainEngine";

class DiseaseEngine {

    private running = false;

    start() {

        this.running = true;

    }

    stop() {

        this.running = false;

    }

    update() {

    if (!this.running) return;

    for (let i = 0; i < 96; i++) {

        const name = brainEngine.getRegionName(i);

        if (

            name.includes("Hipp") ||

            name.includes("PHC") ||

            name.includes("Amyg") ||

            name.includes("TC")

        ) {

            const activity = brainEngine.getActivity(i);

            const health = brainEngine.getHealth(i);

            brainEngine.setActivity(

                i,

                Math.max(0.05, activity - 0.0005)

            );

            brainEngine.setHealth(

                i,

                Math.max(0.2, health - 0.0002)

            );

        }

    }

}

}

export const diseaseEngine = new DiseaseEngine();