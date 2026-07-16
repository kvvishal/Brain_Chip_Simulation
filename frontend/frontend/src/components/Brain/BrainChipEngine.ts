
import * as THREE from "three";

import { brainEngine } from "./BrainEngine";
import { brainPositionStore } from "./BrainPositionStore";

class BrainChipEngine {

    private chipPosition = new THREE.Vector3(
        0.3,
        -0.3,
        0
    );

    // Later BrainPulse will animate this value
    private stimulationRadius = 0.45;

    // Regions currently affected by the chip
    private activeRegions = new Set<number>();

    // -----------------------------
    // Getters
    // -----------------------------

    getChipPosition() {

        return this.chipPosition;

    }

    getStimulationRadius() {

        return this.stimulationRadius;

    }

    getNearestRegion(): number {

        const positions = brainPositionStore.get();

        let nearest = 0;

        let minDistance = Number.MAX_VALUE;

        for (let i = 0; i < positions.length; i++) {

            const distance =
                positions[i].distanceTo(this.chipPosition);

            if (distance < minDistance) {

                minDistance = distance;

                nearest = i;

            }

        }

        return nearest;

    }

    setStimulationRadius(radius: number) {

        this.stimulationRadius = radius;

    }

    isRegionActive(id: number) {

        return this.activeRegions.has(id);

    }

    // -----------------------------
    // Update
    // -----------------------------

    update() {

        if (!brainEngine.isChipActive()) {

            this.activeRegions.clear();

            return;

        }

        const positions = brainPositionStore.get();

        this.activeRegions.clear();

        for (let i = 0; i < positions.length; i++) {

            const distance =
                positions[i].distanceTo(this.chipPosition);

            if (distance > this.stimulationRadius)
                continue;

            // Region is inside stimulation radius
            this.activeRegions.add(i);

            // 1 at centre → 0 at edge
            const strength =
                1 - distance / this.stimulationRadius;

            brainEngine.setActivity(

                i,

                Math.min(

                    brainEngine.getActivity(i)
                    + strength * 0.004,

                    1

                )

            );

            brainEngine.setHealth(

                i,

                Math.min(

                    brainEngine.getHealth(i)
                    + strength * 0.002,

                    1

                )

            );

        }

    }

}

export const brainChipEngine =
    new BrainChipEngine();
