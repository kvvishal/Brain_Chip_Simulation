"use client";

import { brainEngine } from "../Brain/BrainEngine";
import { brainSignalPropagation } from "../Brain/BrainSignalPropagation";
import { recoveryEngine } from "../Brain/RecoveryEngine";

export default function BrainStatistics() {
    const regions = brainEngine.getRegions();
    const totalRegions = regions.length;

    // =============================================
    // Region statistics
    // =============================================

    const infectedRegions =
        regions.filter(
            region =>
                region.infected ||
                region.disease > 0
        ).length;

    const healthyRegions =
        totalRegions - infectedRegions;

    const stimulatedRegions =
        regions.filter(
            region => region.stimulated
        ).length;

    // =============================================
    // Average health
    // =============================================

    const averageHealth =
        totalRegions === 0
            ? 0
            : (
                regions.reduce(
                    (sum, region) =>
                        sum + region.health,
                    0
                ) / totalRegions
            ) * 100;

    // =============================================
    // Average activity
    // =============================================

    const averageActivity =
        totalRegions === 0
            ? 0
            : (
                regions.reduce(
                    (sum, region) =>
                        sum + region.activity,
                    0
                ) / totalRegions
            ) * 100;

    // =============================================
    // Treatment
    // =============================================

    const activeTreatment =
        brainSignalPropagation
            .getActiveRegionCount();

    const treatmentCoverage =
        brainEngine.isChipActive()
            ? brainSignalPropagation
                .getTreatmentCoverage()
            : 0;

    const recovery =
        recoveryEngine
            .getRecoveryPercentage();

    return (
        <div className="bg-[#111827] rounded-xl h-full p-6">

            <h2 className="text-xl text-cyan-400 font-bold mb-6">
                Brain Statistics
            </h2>

            <div className="grid grid-cols-2 gap-4">

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
                    value={infectedRegions}
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
                        brainEngine.isChipActive()
                            ? "ACTIVE"
                            : "OFF"
                    }
                />

            </div>

        </div>
    );
}

function StatCard({
    title,
    value
}: {
    title: string;
    value: string | number;
}) {
    return (
        <div
            className="
                bg-slate-800/60
                border
                border-slate-700
                rounded-lg
                p-4
            "
        >
            <p className="text-xs text-slate-400 mb-2">
                {title}
            </p>

            <p className="text-xl font-bold text-white">
                {value}
            </p>
        </div>
    );
}