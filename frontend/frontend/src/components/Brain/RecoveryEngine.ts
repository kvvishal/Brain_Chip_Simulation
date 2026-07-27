import { brainEngine } from "./BrainEngine";
import { brainSignalPropagation } from "./BrainSignalPropagation";

class RecoveryEngine {

    // ==================================================
    // Recovery configuration
    // ==================================================

    /*
     * These values are intentionally faster than a
     * biological model because this is a visual
     * simulation.
     *
     * Treatment should still be gradual, but users
     * should be able to observe completion.
     */

    private recoveryRate = 0.003;

    private diseaseSuppressionRate = 0.003;

    private activityRecoveryRate = 0.006;

    // Region considered functionally recovered
    private healthyThreshold = 0.90;

    private activityThreshold = 0.90;

    private diseaseClearThreshold = 0.01;

    // ==================================================
    // Update recovery
    // ==================================================

    update() {

        if (!brainEngine.isChipActive()) {
            return;
        }

        /*
         * IMPORTANT:
         *
         * Work from a snapshot.
         *
         * completeTreatment() removes regions from the
         * active set, so we should not iterate directly
         * over a collection that is being modified.
         */

        const activeRegions =
            brainSignalPropagation.getActiveRegions();

        for (const regionId of activeRegions) {

            if (
                regionId < 0 ||
                regionId >= brainEngine.getRegionCount()
            ) {
                continue;
            }

            const region =
                brainEngine.getRegion(regionId);

            // ==========================================
            // HEALTH RECOVERY
            // ==========================================

            const currentHealth =
                brainEngine.getHealth(regionId);

            const recoveredHealth =
                Math.min(
                    currentHealth +
                    this.recoveryRate,
                    1
                );

            brainEngine.setHealth(
                regionId,
                recoveredHealth
            );

            // ==========================================
            // ACTIVITY RECOVERY
            // ==========================================

            const currentActivity =
                brainEngine.getActivity(regionId);

            /*
             * Exponential recovery.
             *
             * Recovery slows naturally as activity
             * approaches normal levels.
             */

            const recoveredActivity =
                currentActivity +
                (
                    1 - currentActivity
                ) *
                this.activityRecoveryRate;

            brainEngine.setActivity(
                regionId,
                Math.min(
                    recoveredActivity,
                    1
                )
            );

            // ==========================================
            // DISEASE SUPPRESSION
            // ==========================================

            region.disease =
                Math.max(
                    0,
                    region.disease -
                    this.diseaseSuppressionRate
                );

            // ==========================================
            // CLEAR DISEASE STATE
            // ==========================================

            if (
                region.disease <=
                this.diseaseClearThreshold
            ) {

                region.disease = 0;

                region.infected = false;
            }

            // ==========================================
            // CHECK TREATMENT COMPLETION
            // ==========================================

            const treatmentComplete =

                region.disease === 0 &&

                recoveredHealth >=
                    this.healthyThreshold &&

                recoveredActivity >=
                    this.activityThreshold;

            if (treatmentComplete) {

                /*
                 * Normalize the recovered region.
                 *
                 * This prevents tiny floating-point
                 * differences from leaving visually
                 * inconsistent recovered regions.
                 */

                brainEngine.setHealth(
                    regionId,
                    1
                );

                brainEngine.setActivity(
                    regionId,
                    1
                );

                region.disease = 0;
                region.infected = false;

                brainSignalPropagation
                    .completeTreatment(
                        regionId
                    );
            }
        }
    }

    // ==================================================
    // Whole-brain recovery percentage
    // ==================================================

    getRecoveryPercentage(): number {

        const count =
            brainEngine.getRegionCount();

        if (count === 0) {
            return 0;
        }

        let totalHealth = 0;

        for (
            let i = 0;
            i < count;
            i++
        ) {

            totalHealth +=
                brainEngine.getHealth(i);
        }

        return (
            totalHealth /
            count
        ) * 100;
    }

    // ==================================================
    // Active treatment count
    // ==================================================

    getActiveTreatmentCount() {

        return brainSignalPropagation
            .getActiveRegionCount();
    }

    // ==================================================
    // Treatment coverage
    // ==================================================

    getTreatmentCoverage() {

        return brainSignalPropagation
            .getTreatmentCoverage();
    }
}

export const recoveryEngine =
    new RecoveryEngine();