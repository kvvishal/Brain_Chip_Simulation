import { brainEngine } from "./BrainEngine";
import { brainGraph } from "./BrainGraph";
import { SimulationConfig } from "./SimulationConfig";

class DiseasePropagation {

    private enabled = false;

    private infected = new Set<number>();

    start(seed: number) {

        this.enabled = true;

        this.infected.clear();

        this.infected.add(seed);

        const region = brainEngine.getRegion(seed);

        region.disease = 1;

        region.infected = true;

    }

    stop() {

        this.enabled = false;

    }

    update() {

        if (!this.enabled) return;

        const newInfected: number[] = [];

        this.infected.forEach(id => {

            const region = brainEngine.getRegion(id);

            const neighbours = brainGraph.neighbours(id);

            neighbours.forEach(edge => {

                const target = brainEngine.getRegion(edge.target);

                const spread =
                    region.disease *
                    edge.weight *
                    SimulationConfig.diseaseSpreadRate;

                target.disease += spread;

                target.disease = Math.min(1, target.disease);

                target.health -=
                    spread *
                    SimulationConfig.diseaseDamageRate;

                target.health = Math.max(0, target.health);

                target.activity *= target.health;

                if (
                    target.disease > 0.10 &&
                    !target.infected
                ) {

                    target.infected = true;

                    newInfected.push(edge.target);

                }

            });

        });

        newInfected.forEach(id => this.infected.add(id));

    }

}

export const diseasePropagation =
new DiseasePropagation();