import { brainGraph } from "./BrainGraph";
import { brainEngine } from "./BrainEngine";
import { SimulationConfig } from "./SimulationConfig";

class DiseasePropagation {

    private running = false;

    private infected = new Set<number>();

    private lastUpdate = 0;

    // Slower progression
    private updateInterval = 400;

    // Current Alzheimer's progression stage
    private stage = 1;

    // Counts simulation updates
    private progressionTicks = 0;

    // --------------------------------------------------
    // Start
    // --------------------------------------------------

    start(seed: number) {

        const regionCount =
            brainEngine.getRegionCount();

        console.log(
            "Starting Alzheimer's propagation:",
            "seed =", seed,
            "regions =", regionCount
        );

        if (regionCount === 0) {

            console.warn(
                "DiseasePropagation.start(): brain not initialized."
            );

            return;
        }

        if (
            seed < 0 ||
            seed >= regionCount
        ) {

            console.error(
                `Invalid Alzheimer's seed: ${seed}`
            );

            return;
        }

        this.running = true;

        this.infected.clear();

        this.progressionTicks = 0;

        this.stage = 1;

        this.lastUpdate =
            performance.now();

        this.infected.add(seed);

        const region =
            brainEngine.getRegion(seed);

        region.disease = Math.max(
            region.disease,
            0.30
        );

        region.infected = true;

        console.log(
            "Alzheimer's started:",
            seed,
            region.name
        );

        console.log(
            "Alzheimer's Stage 1: Memory Network"
        );
    }

    // --------------------------------------------------
    // Stop
    // --------------------------------------------------

    stop() {

        this.running = false;

        this.infected.clear();
    }

    isRunning() {

        return this.running;
    }

    // --------------------------------------------------
    // Region classification
    // --------------------------------------------------

    private getRegionStage(
        name: string
    ): number {

        /*
         * STAGE 1
         * Hippocampus + parahippocampal memory regions
         */

        if (
            name.includes("HC") ||
            name.includes("PHC")
        ) {
            return 1;
        }

        /*
         * STAGE 2
         * Temporal regions
         */

        if (
            name.includes("TC") ||
            name.startsWith("TM-")
        ) {
            return 2;
        }

        /*
         * STAGE 3
         * Parietal / association / cingulate areas
         */

        if (
            name.includes("PC") ||
            name.includes("CC") ||
            name.includes("Ip")
        ) {
            return 3;
        }

        /*
         * STAGE 4
         * Frontal / motor-related areas
         */

        if (
            name.includes("PFC") ||
            name.includes("PMC") ||
            name.includes("M1") ||
            name.includes("FEF")
        ) {
            return 4;
        }

        /*
         * STAGE 5
         * Remaining brain network
         */

        return 5;
    }

    // --------------------------------------------------
    // Update disease stage
    // --------------------------------------------------

    private updateStage() {

        const count =
            brainEngine.getRegionCount();

        if (count === 0)
            return;

        let memoryDisease = 0;
        let memoryCount = 0;

        let temporalDisease = 0;
        let temporalCount = 0;

        let associationDisease = 0;
        let associationCount = 0;

        let frontalDisease = 0;
        let frontalCount = 0;

        for (let i = 0; i < count; i++) {

            const region =
                brainEngine.getRegion(i);

            const stage =
                this.getRegionStage(
                    region.name
                );

            if (stage === 1) {

                memoryDisease +=
                    region.disease;

                memoryCount++;

            }

            else if (stage === 2) {

                temporalDisease +=
                    region.disease;

                temporalCount++;

            }

            else if (stage === 3) {

                associationDisease +=
                    region.disease;

                associationCount++;

            }

            else if (stage === 4) {

                frontalDisease +=
                    region.disease;

                frontalCount++;

            }

        }

        const memoryAverage =
            memoryCount > 0
                ? memoryDisease / memoryCount
                : 0;

        const temporalAverage =
            temporalCount > 0
                ? temporalDisease / temporalCount
                : 0;

        const associationAverage =
            associationCount > 0
                ? associationDisease / associationCount
                : 0;

        const frontalAverage =
            frontalCount > 0
                ? frontalDisease / frontalCount
                : 0;

        let newStage =
            this.stage;

        // Minimum times stop stages jumping too quickly

        if (
            this.stage === 1 &&
            this.progressionTicks >= 40 &&
            memoryAverage >= 0.20
        ) {

            newStage = 2;

        }

        else if (
            this.stage === 2 &&
            this.progressionTicks >= 90 &&
            temporalAverage >= 0.12
        ) {

            newStage = 3;

        }

        else if (
            this.stage === 3 &&
            this.progressionTicks >= 150 &&
            associationAverage >= 0.12
        ) {

            newStage = 4;

        }

        else if (
            this.stage === 4 &&
            this.progressionTicks >= 220 &&
            frontalAverage >= 0.12
        ) {

            newStage = 5;

        }

        if (newStage !== this.stage) {

            this.stage =
                newStage;

            console.log(
                `Alzheimer's progressed to Stage ${this.stage}`
            );

            console.log({
                memoryAverage:
                    memoryAverage.toFixed(3),

                temporalAverage:
                    temporalAverage.toFixed(3),

                associationAverage:
                    associationAverage.toFixed(3),

                frontalAverage:
                    frontalAverage.toFixed(3)
            });

        }

    }

    // --------------------------------------------------
    // Main update
    // --------------------------------------------------

    update() {

        if (!this.running)
            return;

        const regionCount =
            brainEngine.getRegionCount();

        if (regionCount === 0)
            return;

        const now =
            performance.now();

        if (
            now - this.lastUpdate <
            this.updateInterval
        ) {
            return;
        }

        this.lastUpdate = now;

        this.progressionTicks++;

        this.updateStage();

        const newRegions =
            new Set<number>();

        const currentlyInfected =
            Array.from(this.infected);

        // --------------------------------------------------
        // Process infected regions
        // --------------------------------------------------

        currentlyInfected.forEach(id => {

            if (
                id < 0 ||
                id >= regionCount
            ) {
                return;
            }

            const source =
                brainEngine.getRegion(id);

            // ----------------------------------------------
            // Existing region deteriorates gradually
            // ----------------------------------------------

            source.disease = Math.min(
                1,
                source.disease + 0.0015
            );

            source.health = Math.max(
                SimulationConfig.minimumHealth,
                source.health - 0.001
            );

            source.activity = Math.max(
                0.05,
                source.activity - 0.001
            );

            source.connectionStrength =
                Math.max(
                    0.1,
                    1 - source.disease
                );

            const neighbours =
                brainGraph.getNeighbours(id);

            // ----------------------------------------------
            // Spread through anatomical graph
            // ----------------------------------------------

            neighbours.forEach(edge => {

                if (
                    edge.target < 0 ||
                    edge.target >= regionCount
                ) {
                    return;
                }

                const target =
                    brainEngine.getRegion(
                        edge.target
                    );

                const targetStage =
                    this.getRegionStage(
                        target.name
                    );

                /*
                 * CRITICAL CHANGE:
                 *
                 * Alzheimer's cannot spread into regions
                 * belonging to later stages yet.
                 */

                if (
                    targetStage >
                    this.stage
                ) {
                    return;
                }

                // ------------------------------------------
                // Connection weight
                // ------------------------------------------

                const normalizedWeight =
                    Math.min(
                        Math.max(
                            edge.weight / 5,
                            0
                        ),
                        1
                    );

                /*
                 * Disease spreads more strongly when:
                 *
                 * source disease is high
                 * anatomical connection is strong
                 */

                let spread =
                    source.disease *
                    normalizedWeight *
                    SimulationConfig.diseaseSpreadRate;

                /*
                 * Slow down transmission considerably.
                 */

                spread *= 0.12;

                // ------------------------------------------
                // Disease accumulation
                // ------------------------------------------

                target.disease =
                    Math.min(
                        1,
                        target.disease +
                        spread
                    );

                // ------------------------------------------
                // Health damage
                // ------------------------------------------

                target.health =
                    Math.max(
                        SimulationConfig.minimumHealth,

                        target.health -
                        spread *
                        SimulationConfig.diseaseDamageRate
                    );

                // ------------------------------------------
                // Activity loss
                // ------------------------------------------

                target.activity =
                    Math.max(
                        0.05,

                        target.activity -
                        spread *
                        SimulationConfig.activityLossRate
                    );

                // ------------------------------------------
                // Connection deterioration
                // ------------------------------------------

                target.connectionStrength =
                    Math.max(
                        0.1,
                        1 - target.disease
                    );

                // ------------------------------------------
                // Newly infected
                // ------------------------------------------

                if (
                    target.disease >=
                        SimulationConfig.infectionThreshold
                    &&
                    !target.infected
                ) {

                    target.infected = true;

                    newRegions.add(
                        edge.target
                    );

                    console.log(
                        "Disease reached:",
                        edge.target,
                        target.name,
                        "Stage:",
                        targetStage,
                        "Disease:",
                        target.disease.toFixed(2)
                    );
                }
            });
        });

        // Newly infected nodes begin spreading
        // during the NEXT update cycle.

        newRegions.forEach(id => {

            this.infected.add(id);
        });
    }

    // --------------------------------------------------
    // Dashboard helpers
    // --------------------------------------------------

    getInfectedRegions() {

        return [
            ...this.infected
        ];
    }

    getInfectedCount() {

        return this.infected.size;
    }

    getStage() {

        return this.stage;
    }

    getProgressionTicks() {

        return this.progressionTicks;
    }
}

export const diseasePropagation =
    new DiseasePropagation();