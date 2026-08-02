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

        const count = brainEngine.getRegionCount();

        for (let i = 0; i < count; i++) {

            const region = brainEngine.getRegion(i);

            /*
            * Ignore healthy regions.
            */

            if (
                !region.infected &&
                region.disease <= 0
            ) {
                continue;
            }

            const health =
                brainEngine.getHealth(i);

            const activity =
                brainEngine.getActivity(i);

            /*
            * Damage scales with disease severity.
            *
            * disease = 0.2  -> slow decline
            * disease = 0.5  -> medium decline
            * disease = 1.0  -> rapid decline
            */

            const damage =
                Math.max(region.disease, 0.1);

            // ==========================
            // HEALTH LOSS
            // ==========================

            const newHealth =
                Math.max(
                    0.05,
                    health -
                    damage * 0.002
                );

            brainEngine.setHealth(
                i,
                newHealth
            );

            // ==========================
            // ACTIVITY LOSS
            // ==========================

            const newActivity =
                Math.max(
                    0.05,
                    activity -
                    damage * 0.003
                );

            brainEngine.setActivity(
                i,
                newActivity
            );
        }

    }

}

export const diseaseEngine = new DiseaseEngine();