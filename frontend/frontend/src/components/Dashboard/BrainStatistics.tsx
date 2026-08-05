"use client";

import { brainEngine } from "../Brain/BrainEngine";
import { useBrain } from "../Brain/BrainContext";
import { brainSignalPropagation } from "../Brain/BrainSignalPropagation";
import { recoveryEngine } from "../Brain/RecoveryEngine";

export default function BrainStatistics() {

    /*
     * Reading version subscribes this component
     * to BrainContext refreshes.
     */
    const { version } = useBrain();

    const regions =
        brainEngine.getRegions();

    const totalRegions =
        regions.length;

    // =============================================
    // REGION STATISTICS
    // =============================================

    const damagedRegions =
        regions.filter(
            region =>
                region.infected ||
                region.disease > 0.01
        ).length;

    /*
     * A region counts as healthy only when
     * disease, health and neural activity
     * have all returned to healthy levels.
     */
    const healthyRegions =
        regions.filter(
            region =>
                !region.infected &&
                region.disease <= 0.01 &&
                region.health >= 0.90
        ).length;

    const stimulatedRegions =
        regions.filter(
            region =>
                region.stimulated
        ).length;

    // =============================================
    // AVERAGE BRAIN HEALTH
    // =============================================

    const averageHealth =
        totalRegions === 0
            ? 0
            : (
                regions.reduce(
                    (sum, region) =>
                        sum + region.health,
                    0
                ) /
                totalRegions
            ) * 100;

    // =============================================
    // AVERAGE NEURAL ACTIVITY
    // =============================================

    const averageActivity =
        totalRegions === 0
            ? 0
            : (
                regions.reduce(
                    (sum, region) =>
                        sum + region.activity,
                    0
                ) /
                totalRegions
            ) * 100;

    // =============================================
    // CHIP / TREATMENT
    // =============================================

    const chipActive =
        brainEngine.isChipActive();

    const activeTreatment =
        brainSignalPropagation
            .getActiveRegionCount();

    const treatmentCoverage =
        chipActive
            ? brainSignalPropagation
                .getTreatmentCoverage()
            : 0;

    const recovery =
        recoveryEngine
            .getRecoveryPercentage();

    // Prevent unused-variable warning while
    // still subscribing to context updates.
    void version;

    // =============================================
    // UI
    // =============================================

    return (

        <div className="bg-[#111827] rounded-xl h-full p-6">

            <h2 className="text-xl text-cyan-400 font-bold mb-6">
                Brain Statistics
            </h2>

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-4
                "
            >

                <StatCard
                    title="Total Regions"
                    value={totalRegions}
                />

                <StatCard
                    title="Healthy Regions"
                    value={healthyRegions}
                />

                <StatCard
                    title="Damaged Regions"
                    value={damagedRegions}
                />

                <StatCard
                    title="Stimulated Regions"
                    value={stimulatedRegions}
                />

                <StatCard
                    title="Brain Health"
                    value={`${averageHealth.toFixed(1)}%`}
                />

                <StatCard
                    title="Neural Activity"
                    value={`${averageActivity.toFixed(1)}%`}
                />

                <StatCard
                    title="Active Treatment"
                    value={activeTreatment}
                />

                <StatCard
                    title="Treatment Coverage"
                    value={`${treatmentCoverage.toFixed(1)}%`}
                />

                <StatCard
                    title="Brain Recovery"
                    value={`${recovery.toFixed(1)}%`}
                />

                <StatCard
                    title="Chip"
                    value={
                        chipActive
                            ? "ACTIVE"
                            : "OFF"
                    }
                />

            </div>

        </div>
    );
}

// ==================================================
// STAT CARD
// ==================================================

function StatCard({
    title,
    value
}: {
    title: string;
    value: string | number;
}) {

    const numericValue =
        typeof value === "string"
            ? parseFloat(value)
            : value;

    const showBar =
        typeof numericValue === "number" &&
        !Number.isNaN(numericValue) &&
        numericValue >= 0 &&
        numericValue <= 100;

    return (

        <div
            className="
                bg-slate-800/60
                border
                border-slate-700
                rounded-xl
                p-4
                transition-all
                duration-300
                hover:border-cyan-500
                hover:shadow-lg
                hover:shadow-cyan-900/20
            "
        >

            <p className="text-xs text-slate-400 mb-2">

                {title}

            </p>

            <p className="text-2xl font-bold text-white mb-3">

                {value}

            </p>

            {

                showBar && (

                    <div
                        className="
                            w-full
                            h-2
                            bg-slate-700
                            rounded-full
                            overflow-hidden
                        "
                    >

                        <div

                            className="
                                h-full
                                rounded-full
                                bg-gradient-to-r
                                from-cyan-500
                                to-emerald-400
                                transition-all
                                duration-500
                            "

                            style={{

                                width: `${numericValue}%`

                            }}

                        />

                    </div>

                )

            }

        </div>

    );

}