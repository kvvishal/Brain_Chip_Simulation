import { brainEngine } from "./BrainEngine";
import { brainSignalPropagation } from "./BrainSignalPropagation";

class RecoveryEngine {

    // ----------------------------------------------
    // Recovery configuration
    // ----------------------------------------------

    private recoveryRate = 0.0015;

    private diseaseSuppressionRate =
        0.001;

    private activityRecoveryRate =
        0.002;

    // Region is considered functionally recovered
    // only after reaching these values.
    private healthyThreshold =
        0.90;

    private activityThreshold =
        0.90;

    private diseaseClearThreshold =
        0.01;

    // --------------------------------------------------
    // Update recovery
    // --------------------------------------------------

    update() {

        if (
            !brainEngine.isChipActive()
        ) {
            return;
        }

        const count =
            brainEngine.getRegionCount();

        for (
            let i = 0;
            i < count;
            i++
        ) {

            /*
             * ONLY regions currently reached
             * by chip treatment can recover.
             */

            if (
                !brainSignalPropagation
                    .isRegionActive(i)
            ) {

                continue;
            }

            const region =
                brainEngine.getRegion(i);

            // ==========================================
            // HEALTH RECOVERY
            // ==========================================

            const currentHealth =
                brainEngine.getHealth(i);

            const recoveredHealth =
                Math.min(
                    currentHealth +
                        this.recoveryRate,
                    1
                );

            brainEngine.setHealth(
                i,
                recoveredHealth
            );

            // ==========================================
            // ACTIVITY RECOVERY
            // ==========================================

            const currentActivity =
                brainEngine.getActivity(i);

            /*
             * Recovery becomes naturally slower
             * as activity approaches 1.
             */

            const recoveredActivity =
                currentActivity +
                (
                    1 -
                    currentActivity
                ) *
                this.activityRecoveryRate;

            brainEngine.setActivity(
                i,
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
            // CLEAR ALZHEIMER'S DAMAGE
            // ==========================================

            if (
                region.disease <=
                this.diseaseClearThreshold
            ) {

                region.disease = 0;

                region.infected =
                    false;
            }

            // ==========================================
            // CHECK COMPLETE RECOVERY
            // ==========================================

            /*
             * Disease reaching zero alone is NOT
             * sufficient.
             *
             * The region should also recover its
             * health and neural activity.
             */

            const treatmentComplete =
                region.disease <=
                    this.diseaseClearThreshold &&

                recoveredHealth >=
                    this.healthyThreshold &&

                recoveredActivity >=
                    this.activityThreshold;

            if (
                treatmentComplete
            ) {

                brainSignalPropagation
                    .completeTreatment(i);
            }
        }
    }

    // --------------------------------------------------
    // Whole-brain recovery percentage
    // --------------------------------------------------

    getRecoveryPercentage():
        number {

        const count =
            brainEngine.getRegionCount();

        if (
            count === 0
        ) {

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

    // --------------------------------------------------
    // Active treatment count
    // --------------------------------------------------

    getActiveTreatmentCount() {

        return brainSignalPropagation
            .getActiveRegionCount();
    }

    // --------------------------------------------------
    // Treatment coverage
    // --------------------------------------------------

    getTreatmentCoverage() {

        return brainSignalPropagation
            .getTreatmentCoverage();
    }
}

export const recoveryEngine =
    new RecoveryEngine();