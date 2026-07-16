import { brainGraph } from "./BrainGraph";

class BrainSignalPropagation {

    // Regions currently carrying the signal
    private activeRegions = new Set<number>();

    // Queue for BFS propagation
    private frontier: number[] = [];

    // Prevent revisiting
    private visited = new Set<number>();

    /**
     * Start propagation from one region
     */
    start(startRegion: number) {

        this.activeRegions.clear();
        this.frontier = [];
        this.visited.clear();

        this.activeRegions.add(startRegion);
        this.frontier.push(startRegion);
        this.visited.add(startRegion);

    }

    /**
     * Spread one hop through the graph
     */
    private lastPropagation = 0;

    update() {

        const now = performance.now();

        if (now - this.lastPropagation < 250)
            return;

        this.lastPropagation = now;

        if (this.frontier.length === 0)
            return;

        const current = this.frontier.shift()!;

        const neighbours =
            brainGraph.getNeighbours(current);

        console.log(
            "Current:",
            current,
            "Neighbours:",
            neighbours.length
        );

        neighbours.forEach(edge => {

            console.log(
                "Edge:",
                edge.target,
                edge.weight
            );

            if (this.visited.has(edge.target))
                return;

            if (edge.weight < 2)
                return;

            this.visited.add(edge.target);

            this.activeRegions.add(edge.target);

            this.frontier.push(edge.target);

        });

    }

    /**
     * Is this region currently active?
     */
    isRegionActive(region: number) {

        return this.activeRegions.has(region);

    }

    getActiveRegions(): number[] {

        return [...this.activeRegions];

    }
    /**
     * Clear everything
     */
    reset() {

        this.activeRegions.clear();
        this.frontier = [];
        this.visited.clear();

    }

}

export const brainSignalPropagation =
    new BrainSignalPropagation();