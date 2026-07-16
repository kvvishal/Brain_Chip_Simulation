import { brainGraph } from "./BrainGraph";

class NeuralPropagation {

    private activeRegions = new Set<number>();

    activate(region: number) {

        this.activeRegions.clear();

        this.activeRegions.add(region);

    }

    update() {

        const next = new Set<number>();

        this.activeRegions.forEach(region => {

            const neighbours =
                brainGraph.neighbours(region);

            neighbours.forEach(n => {

                next.add(n.target);

            });

        });

        next.forEach(r => this.activeRegions.add(r));

    }

    isActive(region: number) {

        return this.activeRegions.has(region);

    }

}

export const neuralPropagation =
    new NeuralPropagation();