export interface BrainEdge {

    target: number;

    weight: number;

}

class BrainGraph {

    private adjacency = new Map<number, BrainEdge[]>();

    initialize(connections: any[]) {

        this.adjacency.clear();

        connections.forEach(connection => {

            // source -> target
            if (!this.adjacency.has(connection.source)) {

                this.adjacency.set(connection.source, []);

            }

            this.adjacency.get(connection.source)!.push({

                target: connection.target,

                weight: connection.weight

            });

            // target -> source
            if (!this.adjacency.has(connection.target)) {

                this.adjacency.set(connection.target, []);

            }

            this.adjacency.get(connection.target)!.push({

                target: connection.source,

                weight: connection.weight

            });

        });

        console.log(
            `BrainGraph Loaded: ${this.adjacency.size} Regions`
        );

    }

    getNeighbours(regionId: number): BrainEdge[] {

        return this.adjacency.get(regionId) || [];

    }

    getRegionCount(): number {

        return this.adjacency.size;

    }

}

export const brainGraph = new BrainGraph();