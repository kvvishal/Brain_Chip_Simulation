import { brainEngine } from "./BrainEngine";
import { brainSignalPropagation } from "./BrainSignalPropagation";

class RecoveryEngine {

    // ==================================================
    // Recovery configuration
    // ==================================================

    private recoveryRate = 0.003;

    private diseaseSuppressionRate = 0.003;

    private activityRecoveryRate = 0.006;

    private healthyThreshold = 0.90;

    private activityThreshold = 0.90;

    private diseaseClearThreshold = 0.01;

    // ==================================================
    // Recovery tracking
    // ==================================================

    /*
     * Stores the amount of disease that existed when
     * chip treatment started.
     *
     * Recovery is measured against this baseline.
     */

    private initialDiseaseLoad: number | null = null;

    // ==================================================
    // RESET
    // ==================================================

    reset() {

        this.initialDiseaseLoad = null;

    }

    // ==================================================
    // CAPTURE TREATMENT BASELINE
    // ==================================================

    private captureInitialDiseaseLoad() {

        if (
            this.initialDiseaseLoad !== null
        ) {
            return;
        }

        const regions =
            brainEngine.getRegions();

        this.initialDiseaseLoad =
            regions.reduce(
                (sum, region) =>
                    sum + region.disease,
                0
            );

        console.log(
            "Initial chip disease load:",
            this.initialDiseaseLoad
        );
    }

    // ==================================================
    // UPDATE RECOVERY
    // ==================================================

    update() {

        if (
            !brainEngine.isChipActive()
        ) {
            return;
        }

        /*
         * Capture Alzheimer's damage before the chip
         * begins removing it.
         */

        this.captureInitialDiseaseLoad();

        /*
         * Work from a snapshot because
         * completeTreatment() modifies the active set.
         */

        const activeRegions =
            brainSignalPropagation
                .getActiveRegions();

        for (
            const regionId of activeRegions
        ) {

            if (
                regionId < 0 ||
                regionId >=
                    brainEngine.getRegionCount()
            ) {
                continue;
            }

            const region =
                brainEngine.getRegion(
                    regionId
                );

            // ==========================================
            // HEALTH RECOVERY
            // ==========================================

            const currentHealth =
                brainEngine.getHealth(
                    regionId
                );

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
                brainEngine.getActivity(
                    regionId
                );

            const recoveredActivity =
                currentActivity +
                (
                    1 -
                    currentActivity
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
            // CLEAR DISEASE
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
                 * Normalize fully recovered region.
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
    // WHOLE-BRAIN RECOVERY PERCENTAGE
    // ==================================================

    getRecoveryPercentage(): number {

        /*
         * Recovery only has meaning during
         * chip treatment.
         */

        if (
            !brainEngine.isChipActive()
        ) {
            return 0;
        }

        /*
         * Capture baseline if dashboard requests the
         * value before the first recovery update.
         */

        this.captureInitialDiseaseLoad();

        if (
            this.initialDiseaseLoad === null ||
            this.initialDiseaseLoad <= 0
        ) {
            return 0;
        }

        const regions =
            brainEngine.getRegions();

        const currentDiseaseLoad =
            regions.reduce(
                (sum, region) =>
                    sum + region.disease,
                0
            );

        const recoveredDisease =
            this.initialDiseaseLoad -
            currentDiseaseLoad;

        const percentage =
            (
                recoveredDisease /
                this.initialDiseaseLoad
            ) * 100;

        return Math.max(
            0,
            Math.min(
                percentage,
                100
            )
        );
    }

    // ==================================================
    // ACTIVE TREATMENT COUNT
    // ==================================================

    getActiveTreatmentCount() {

        return brainSignalPropagation
            .getActiveRegionCount();

    }

    // ==================================================
    // TREATMENT COVERAGE
    // ==================================================

    getTreatmentCoverage() {

        return brainSignalPropagation
            .getTreatmentCoverage();

    }
}

export const recoveryEngine =
    new RecoveryEngine();