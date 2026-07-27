import { brainGraph } from "./BrainGraph";
import { brainEngine } from "./BrainEngine";

type FrontierNode = {
    id: number;
    depth: number;
};

class BrainSignalPropagation {

    // Regions currently receiving chip treatment
    private activeRegions = new Set<number>();

    // Exact anatomical connections traversed by chip
    private activeConnections = new Set<string>();

    // BFS queue
    private frontier: FrontierNode[] = [];

    /*
     * All regions reached during this treatment session.
     *
     * IMPORTANT:
     * This is different from activeRegions because
     * activeRegions can shrink after recovery.
     */
    private visited = new Set<number>();

    private lastPropagation = 0;

    // --------------------------------------------------
    // Treatment configuration
    // --------------------------------------------------

    // Delay between propagation steps
    private propagationInterval = 400;

    // Minimum disease level worth treating
    private diseaseThreshold = 0.12;

    // Maximum graph distance from chip target
    private maxDepth = 5;

    // Maximum number of regions treated per chip session
    private maxActiveRegions = 35;

    // Number of new regions activated per step
    private maxPerStep = 2;

    // Minimum anatomical connection strength
    private minimumConnectionWeight = 2;

    // --------------------------------------------------
    // Connection helpers
    // --------------------------------------------------

    private connectionKey(
        source: number,
        target: number
    ) {

        /*
         * Connections are treated as undirected.
         *
         * 5 -> 10 and 10 -> 5 therefore generate
         * the same key.
         */

        const a =
            Math.min(source, target);

        const b =
            Math.max(source, target);

        return `${a}-${b}`;
    }

    private activateConnection(
        source: number,
        target: number
    ) {

        this.activeConnections.add(
            this.connectionKey(
                source,
                target
            )
        );
    }

    // --------------------------------------------------
    // Start propagation
    // --------------------------------------------------

    start(startRegion: number) {

        this.reset();

        const regionCount =
            brainEngine.getRegionCount();

        if (
            startRegion < 0 ||
            startRegion >= regionCount
        ) {

            console.error(
                "Invalid chip propagation start region:",
                startRegion
            );

            return;
        }

        this.activeRegions.add(
            startRegion
        );

        this.visited.add(
            startRegion
        );

        this.frontier.push({
            id: startRegion,
            depth: 0
        });

        this.lastPropagation =
            performance.now();

        console.log(
            "Chip signal propagation started from:",
            startRegion,
            brainEngine.getRegionName(
                startRegion
            )
        );
    }

    // --------------------------------------------------
    // Treatment priority
    // --------------------------------------------------

    private getTreatmentPriority(
        regionId: number,
        connectionWeight: number
    ) {

        const region =
            brainEngine.getRegion(
                regionId
            );

        /*
         * Higher score =
         * more important treatment target.
         */

        const diseaseScore =
            region.disease * 5;

        const healthDamage =
            (1 - region.health) * 2;

        const activityDamage =
            (1 - region.activity) * 1.5;

        const infectionScore =
            region.infected
                ? 1
                : 0;

        const connectionScore =
            Math.min(
                connectionWeight / 5,
                1
            );

        return (
            diseaseScore +
            healthDamage +
            activityDamage +
            infectionScore +
            connectionScore
        );
    }

    // --------------------------------------------------
    // Does region require treatment?
    // --------------------------------------------------

    private needsTreatment(
        regionId: number
    ) {

        const region =
            brainEngine.getRegion(
                regionId
            );

        return (
            region.disease >=
                this.diseaseThreshold ||

            region.infected ||

            region.health < 0.90 ||

            region.activity < 0.85
        );
    }

    // --------------------------------------------------
    // Update propagation
    // --------------------------------------------------

    update() {

        if (
            !brainEngine.isChipActive()
        ) {
            return;
        }

        /*
         * Use VISITED here.
         *
         * activeRegions can shrink as regions recover.
         * visited represents total treatment coverage
         * during this chip session.
         */

        if (
            this.visited.size >=
            this.maxActiveRegions
        ) {

            this.frontier = [];

            return;
        }

        const now =
            performance.now();

        if (
            now - this.lastPropagation <
            this.propagationInterval
        ) {

            return;
        }

        this.lastPropagation =
            now;

        if (
            this.frontier.length === 0
        ) {
            return;
        }

        const current =
            this.frontier.shift();

        if (!current)
            return;

        // Stop branch at maximum depth
        if (
            current.depth >=
            this.maxDepth
        ) {

            return;
        }

        const neighbours =
            brainGraph.getNeighbours(
                current.id
            );

        // --------------------------------------------------
        // Remove duplicate neighbour targets
        // --------------------------------------------------

        const uniqueTargets =
            new Map<
                number,
                typeof neighbours[number]
            >();

        for (
            const edge of neighbours
        ) {

            const existing =
                uniqueTargets.get(
                    edge.target
                );

            /*
             * If duplicate connections exist,
             * retain only the strongest.
             */

            if (
                !existing ||
                edge.weight >
                    existing.weight
            ) {

                uniqueTargets.set(
                    edge.target,
                    edge
                );
            }
        }

        // --------------------------------------------------
        // Candidate treatment regions
        // --------------------------------------------------

        const candidates =
            [...uniqueTargets.values()]

                .filter((edge) => {

                    const target =
                        edge.target;

                    // Invalid region
                    if (
                        target < 0 ||
                        target >=
                            brainEngine
                                .getRegionCount()
                    ) {

                        return false;
                    }

                    // Already treated/reached
                    if (
                        this.visited.has(
                            target
                        )
                    ) {

                        return false;
                    }

                    // Weak anatomical pathway
                    if (
                        edge.weight <
                        this.minimumConnectionWeight
                    ) {

                        return false;
                    }

                    // Healthy region
                    if (
                        !this.needsTreatment(
                            target
                        )
                    ) {

                        return false;
                    }

                    return true;
                })

                // Most damaged / useful targets first
                .sort((a, b) => {

                    const scoreA =
                        this.getTreatmentPriority(
                            a.target,
                            a.weight
                        );

                    const scoreB =
                        this.getTreatmentPriority(
                            b.target,
                            b.weight
                        );

                    return (
                        scoreB -
                        scoreA
                    );
                });

        // --------------------------------------------------
        // Activate limited number this step
        // --------------------------------------------------

        let activatedThisStep = 0;

        for (
            const edge of candidates
        ) {

            if (
                activatedThisStep >=
                this.maxPerStep
            ) {

                break;
            }

            /*
             * Again use visited rather than
             * activeRegions.
             */

            if (
                this.visited.size >=
                this.maxActiveRegions
            ) {

                break;
            }

            const targetId =
                edge.target;

            // Defensive duplicate protection
            if (
                this.visited.has(
                    targetId
                )
            ) {

                continue;
            }

            const target =
                brainEngine.getRegion(
                    targetId
                );

            // ----------------------------------------------
            // Mark region reached
            // ----------------------------------------------

            this.visited.add(
                targetId
            );

            // ----------------------------------------------
            // Mark region under active treatment
            // ----------------------------------------------

            this.activeRegions.add(
                targetId
            );

            // ----------------------------------------------
            // Record EXACT anatomical edge used
            // ----------------------------------------------

            this.activateConnection(
                current.id,
                targetId
            );

            // ----------------------------------------------
            // Continue BFS
            // ----------------------------------------------

            this.frontier.push({

                id: targetId,

                depth:
                    current.depth + 1

            });

            activatedThisStep++;

            console.log(
                "Chip reached:",
                targetId,
                target.name,
                "Depth:",
                current.depth + 1,
                "Disease:",
                target.disease.toFixed(2),
                "Health:",
                target.health.toFixed(2),
                "Activity:",
                target.activity.toFixed(2)
            );
        }
    }

    // --------------------------------------------------
    // Is region currently receiving treatment?
    // --------------------------------------------------

    isRegionActive(
        region: number
    ) {

        return this.activeRegions.has(
            region
        );
    }

    // --------------------------------------------------
    // Has region ever been reached?
    // --------------------------------------------------

    hasReached(
        region: number
    ) {

        return this.visited.has(
            region
        );
    }

    // --------------------------------------------------
    // Is connection an actual chip pathway?
    // --------------------------------------------------

    isConnectionActive(
        source: number,
        target: number
    ) {

        /*
         * IMPORTANT:
         *
         * We no longer simply check whether both
         * regions are active.
         *
         * Only the exact anatomical edge traversed
         * by chip propagation gets a cyan signal.
         */

        return this.activeConnections.has(
            this.connectionKey(
                source,
                target
            )
        );
    }

    // --------------------------------------------------
    // Treatment completed
    // --------------------------------------------------

    completeTreatment(
        region: number
    ) {

        if (
            !this.activeRegions.has(
                region
            )
        ) {

            return;
        }

        /*
         * Region no longer requires active
         * artificial stimulation.
         */

        this.activeRegions.delete(
            region
        );

        /*
         * Remove cyan connection only if the
         * opposite region is also no longer
         * actively receiving treatment.
         *
         * This prevents us from breaking an
         * active treatment path prematurely.
         */

        for (
            const connection
            of [...this.activeConnections]
        ) {

            const [a, b] =
                connection
                    .split("-")
                    .map(Number);

            if (
                (
                    a === region &&
                    !this.activeRegions.has(b)
                ) ||
                (
                    b === region &&
                    !this.activeRegions.has(a)
                )
            ) {

                this.activeConnections.delete(
                    connection
                );
            }
        }

        console.log(
            "Chip treatment completed:",
            region,
            brainEngine.getRegionName(
                region
            )
        );
    }

    // --------------------------------------------------
    // Dashboard helpers
    // --------------------------------------------------

    getActiveRegions(): number[] {

        return [
            ...this.activeRegions
        ];
    }

    // Currently being treated
    getActiveRegionCount() {

        return this.activeRegions.size;
    }

    // Total regions reached this session
    getReachedRegionCount() {

        return this.visited.size;
    }

    getPendingRegionCount() {

        return this.frontier.length;
    }

    getMaximumTreatmentRegions() {

        return this.maxActiveRegions;
    }

    getTreatmentCoverage() {

        return (
            this.visited.size /
            this.maxActiveRegions
        ) * 100;
    }

    // --------------------------------------------------
    // Is propagation still happening?
    // --------------------------------------------------

    isPropagating() {

        return (
            this.frontier.length > 0 &&
            this.visited.size <
                this.maxActiveRegions
        );
    }

    // --------------------------------------------------
    // Reset
    // --------------------------------------------------

    reset() {

        this.activeRegions.clear();

        this.activeConnections.clear();

        this.frontier = [];

        this.visited.clear();

        this.lastPropagation = 0;
    }
}

export const brainSignalPropagation =
    new BrainSignalPropagation();