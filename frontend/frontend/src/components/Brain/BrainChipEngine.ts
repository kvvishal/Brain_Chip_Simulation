import * as THREE from "three";

import { brainEngine } from "./BrainEngine";
import { brainPositionStore } from "./BrainPositionStore";

class BrainChipEngine {

    private chipPosition =
        new THREE.Vector3(
            0.3,
            -0.3,
            0
        );

    private stimulationRadius =
        0.45;

    // Regions physically inside chip field
    private activeRegions =
        new Set<number>();

    // Locked treatment target
    private targetRegion:
        number | null = null;

    // --------------------------------------------------
    // Getters
    // --------------------------------------------------

    getChipPosition() {

        return this.chipPosition;
    }

    getStimulationRadius() {

        return this.stimulationRadius;
    }

    setStimulationRadius(
        radius: number
    ) {

        this.stimulationRadius =
            Math.max(
                0,
                radius
            );
    }

    isRegionActive(
        id: number
    ) {

        return this.activeRegions.has(
            id
        );
    }

    getActiveRegions():
        number[] {

        return [
            ...this.activeRegions
        ];
    }

    getTargetRegion():
        number | null {

        return this.targetRegion;
    }

    // --------------------------------------------------
    // Find nearest anatomical region
    // --------------------------------------------------

    getNearestRegion():
        number {

        const positions =
            brainPositionStore.get();

        if (
            positions.length === 0
        ) {

            return -1;
        }

        let nearest = -1;

        let minDistance =
            Number.MAX_VALUE;

        const regionCount =
            brainEngine
                .getRegionCount();

        const count =
            Math.min(
                positions.length,
                regionCount
            );

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const position =
                positions[i];

            if (!position)
                continue;

            const distance =
                position.distanceTo(
                    this.chipPosition
                );

            if (
                distance <
                minDistance
            ) {

                minDistance =
                    distance;

                nearest =
                    i;
            }
        }

        return nearest;
    }

    // --------------------------------------------------
    // Calculate treatment priority
    // --------------------------------------------------

    private calculateTargetScore(
        regionId: number,
        distance: number
    ) {

        const region =
            brainEngine.getRegion(
                regionId
            );

        /*
         * Disease is deliberately the
         * strongest targeting factor.
         */

        const diseaseScore =
            region.disease *
            5;

        const healthDamage =
            (
                1 -
                region.health
            ) *
            2;

        const activityDamage =
            (
                1 -
                region.activity
            ) *
            1.5;

        const infectionScore =
            region.infected
                ? 1
                : 0;

        /*
         * Distance matters, but shouldn't
         * overpower actual disease severity.
         */

        const distancePenalty =
            distance *
            0.5;

        return (
            diseaseScore +
            healthDamage +
            activityDamage +
            infectionScore -
            distancePenalty
        );
    }

    // --------------------------------------------------
    // Is region worth targeting?
    // --------------------------------------------------

    private needsTreatment(
        regionId: number
    ) {

        const region =
            brainEngine.getRegion(
                regionId
            );

        return (
            region.disease >= 0.12 ||
            region.infected ||
            region.health < 0.90 ||
            region.activity < 0.85
        );
    }

    // --------------------------------------------------
    // Select adaptive target
    // --------------------------------------------------

    selectTargetRegion():
        number | null {

        const positions =
            brainPositionStore.get();

        const regionCount =
            brainEngine
                .getRegionCount();

        if (
            positions.length === 0 ||
            regionCount === 0
        ) {

            this.targetRegion =
                null;

            return null;
        }

        const count =
            Math.min(
                positions.length,
                regionCount
            );

        let bestRegion:
            number | null = null;

        let highestScore =
            Number.NEGATIVE_INFINITY;

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const position =
                positions[i];

            if (!position)
                continue;

            /*
             * Don't choose completely healthy
             * regions as treatment origins.
             */

            if (
                !this.needsTreatment(i)
            ) {

                continue;
            }

            const distance =
                position.distanceTo(
                    this.chipPosition
                );

            const score =
                this.calculateTargetScore(
                    i,
                    distance
                );

            if (
                score >
                highestScore
            ) {

                highestScore =
                    score;

                bestRegion =
                    i;
            }
        }

        /*
         * If no damaged region exists,
         * there is nothing useful to target.
         */

        this.targetRegion =
            bestRegion;

        if (
            bestRegion !== null
        ) {

            const region =
                brainEngine.getRegion(
                    bestRegion
                );

            console.log(
                "Adaptive chip target selected:",
                bestRegion,
                region.name,
                "Disease:",
                region.disease.toFixed(2),
                "Health:",
                region.health.toFixed(2),
                "Activity:",
                region.activity.toFixed(2)
            );
        }

        return bestRegion;
    }

    // --------------------------------------------------
    // Explicitly lock target
    // --------------------------------------------------

    setTargetRegion(
        regionId: number
    ) {

        const count =
            brainEngine
                .getRegionCount();

        if (
            regionId < 0 ||
            regionId >= count
        ) {

            console.error(
                "Invalid chip target:",
                regionId
            );

            return;
        }

        this.targetRegion =
            regionId;
    }

    // --------------------------------------------------
    // Clear target
    // --------------------------------------------------

    clearTarget() {

        this.targetRegion =
            null;
    }

    // --------------------------------------------------
    // Update chip state
    // --------------------------------------------------

    update() {

        if (
            !brainEngine
                .isChipActive()
        ) {

            this.activeRegions
                .clear();

            return;
        }

        const positions =
            brainPositionStore.get();

        const regionCount =
            brainEngine
                .getRegionCount();

        if (
            positions.length === 0 ||
            regionCount === 0
        ) {

            return;
        }

        // ----------------------------------------------
        // Detect physical chip field
        // ----------------------------------------------

        this.activeRegions
            .clear();

        const count =
            Math.min(
                positions.length,
                regionCount
            );

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const position =
                positions[i];

            if (!position)
                continue;

            const distance =
                position.distanceTo(
                    this.chipPosition
                );

            if (
                distance <=
                this.stimulationRadius
            ) {

                this.activeRegions.add(
                    i
                );
            }
        }

        /*
         * IMPORTANT:
         *
         * Do NOT call selectTargetRegion()
         * here.
         *
         * update() runs every animation frame.
         * Re-selecting here would allow the
         * treatment origin to change while a
         * propagation session is running.
         */
    }

    // --------------------------------------------------
    // Reset
    // --------------------------------------------------

    reset() {

        this.activeRegions
            .clear();

        this.targetRegion =
            null;
    }
}

export const brainChipEngine =
    new BrainChipEngine()   