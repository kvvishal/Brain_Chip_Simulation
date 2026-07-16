
import { brainGraph } from "./BrainGraph";
import { brainEngine } from "./BrainEngine";
import { SimulationConfig } from "./SimulationConfig";


class DiseasePropagation {

    private running = false;

    private infected = new Set<number>();

    private lastUpdate = 0;

    start(seed: number) {

        this.running = true;

        this.infected.clear();

        this.infected.add(seed);

        const region = brainEngine.getRegion(seed);

        region.disease = 1;

        region.infected = true;

    }

    stop() {

        this.running = false;

        this.infected.clear();

    }

    update() {

        if (!this.running) return;

        const now = performance.now();

        if (now - this.lastUpdate < 100){

            return;
        }

        this.lastUpdate = now;

        this.infected.forEach(id => {

            const newRegions: number[] = [];

            const source = brainEngine.getRegion(id);

            const neighbours = brainGraph.getNeighbours(id);

            neighbours.forEach(edge => {

                const target = brainEngine.getRegion(edge.target);

                const spread =
                    source.disease *
                    edge.weight *
                    SimulationConfig.diseaseSpreadRate;

                target.disease += spread;

                target.disease = Math.min(
                    
                    SimulationConfig.maximumHealth,
                    Math.max(
                        0,
                        target.disease
                    )
                );

                target.health -=
                    spread *
                    SimulationConfig.diseaseDamageRate;

                target.health = Math.min(
                    SimulationConfig.maximumHealth,
                    Math.max(

                        SimulationConfig.minimumHealth,
                        target.health

                    )
                );

                target.activity = Math.max(
                    0,

                    target.activity -
                    spread *
                    SimulationConfig.activityLossRate

                );

                if (
                    target.disease >
                        SimulationConfig.infectionThreshold &&
                    !target.infected
                ) {

                    target.infected = true;

                    newRegions.push(edge.target);

                }

            });

            newRegions.forEach(id => this.infected.add(id));
        });

        

    }

}

export const diseasePropagation =
new DiseasePropagation();
