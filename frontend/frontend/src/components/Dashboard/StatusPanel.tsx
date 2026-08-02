"use client";

import { brainEngine } from "../Brain/BrainEngine";
import { brainChipEngine } from "../Brain/BrainChipEngine";
import { brainSignalPropagation } from "../Brain/BrainSignalPropagation";
import { recoveryEngine } from "../Brain/RecoveryEngine";
import { useBrain } from "../Brain/BrainContext";

export default function StatusPanel() {

    // Subscribes this component to BrainContext refreshes.
    // BrainAnimator calls refresh() while the simulation runs.
    useBrain();

    const regions = brainEngine.getRegions();
    const regionCount = regions.length;

    // ==================================================
    // Brain health
    // ==================================================

    const averageHealth =
        regionCount === 0
            ? 0
            : (
                regions.reduce(
                    (sum, region) =>
                        sum + region.health,
                    0
                ) / regionCount
            ) * 100;

    // ==================================================
    // Neural activity
    // ==================================================

    const averageActivity =
        regionCount === 0
            ? 0
            : (
                regions.reduce(
                    (sum, region) =>
                        sum + region.activity,
                    0
                ) / regionCount
            ) * 100;

    // ==================================================
    // Disease statistics
    // ==================================================

    const infectedRegions =
        regions.filter(
            region =>
                region.infected ||
                region.disease > 0
        ).length;

    const diseaseSpread =
        regionCount === 0
            ? 0
            : (
                infectedRegions /
                regionCount
            ) * 100;

    const averageDisease =
        regionCount === 0
            ? 0
            : (
                regions.reduce(
                    (sum, region) =>
                        sum + region.disease,
                    0
                ) / regionCount
            ) * 100;

    // ==================================================
    // Chip state
    // ==================================================

    const chipActive =
        brainEngine.isChipActive();

    const mode =
        brainEngine.getMode();

    const targetId =
        brainChipEngine.getTargetRegion();

    const targetName =
        targetId !== null &&
        targetId >= 0 &&
        targetId < regionCount
            ? brainEngine.getRegionName(targetId)
            : "None";

    const { version } = useBrain();

    // ==================================================
    // Treatment network
    // ==================================================

    const activeTreatmentRegions =
        brainSignalPropagation
            .getActiveRegionCount();

    const pendingRegions =
        brainSignalPropagation
            .getPendingRegionCount();

    const propagating =
        brainSignalPropagation
            .isPropagating();

    const treatmentCoverage =
        chipActive
            ? brainSignalPropagation
                .getTreatmentCoverage()
            : 0;

    const recoveryPercentage =
        recoveryEngine
            .getRecoveryPercentage();

    // ==================================================
    // UI
    // ==================================================

    return (

        <div className="bg-[#111827] rounded-xl h-full p-6">

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold text-cyan-400">
                    Neural Chip Status
                </h2>

                <span
                    className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                            chipActive
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-slate-700 text-slate-400"
                        }
                    `}
                >
                    {
                        chipActive
                            ? "CHIP ACTIVE"
                            : "CHIP OFF"
                    }
                </span>

            </div>

            <div className="space-y-5">

                <Metric
                    title="Brain Health"
                    value={`${averageHealth.toFixed(1)} %`}
                    percent={averageHealth}
                    color="bg-green-500"
                />

                <Metric
                    title="Neural Activity"
                    value={`${averageActivity.toFixed(1)} %`}
                    percent={averageActivity}
                    color="bg-blue-500"
                />

                <Metric
                    title="Disease Spread"
                    value={`${diseaseSpread.toFixed(1)} %`}
                    percent={diseaseSpread}
                    color="bg-red-500"
                />

                <Metric
                    title="Disease Severity"
                    value={`${averageDisease.toFixed(1)} %`}
                    percent={averageDisease}
                    color="bg-orange-500"
                />

                <div className="border-t border-slate-700 pt-5 space-y-4">

                    <Metric
                        title="Simulation Mode"
                        value={formatMode(mode)}
                    />

                    <Metric
                        title="Chip Status"
                        value={
                            chipActive
                                ? "ACTIVE"
                                : "OFF"
                        }
                    />

                    <Metric
                        title="Adaptive Target"
                        value={targetName}
                    />

                    <Metric
                        title="Active Treatment"
                        value={activeTreatmentRegions}
                    />

                    <Metric
                        title="Pending Propagation"
                        value={pendingRegions}
                    />

                    <Metric
                        title="Propagation"
                        value={
                            chipActive
                                ? propagating
                                    ? "IN PROGRESS"
                                    : "COMPLETE"
                                : "INACTIVE"
                        }
                    />

                </div>

                {chipActive && (

                    <div className="border-t border-slate-700 pt-5 space-y-5">

                        <Metric
                            title="Treatment Coverage"
                            value={`${treatmentCoverage.toFixed(1)} %`}
                            percent={treatmentCoverage}
                            color="bg-cyan-500"
                        />

                        <Metric
                            title="Brain Recovery"
                            value={`${recoveryPercentage.toFixed(1)} %`}
                            percent={recoveryPercentage}
                            color="bg-green-500"
                        />

                    </div>

                )}

            </div>

        </div>
    );
}

// ==================================================
// Metric
// ==================================================

function Metric({

    title,
    value,
    percent,
    color = "bg-cyan-500"

}: {

    title: string;
    value: string | number;
    percent?: number;
    color?: string;

}) {

    const safePercent =
        percent === undefined
            ? undefined
            : Math.max(
                0,
                Math.min(percent, 100)
            );

    return (

        <div className="space-y-2">

            <div className="flex justify-between gap-4">

                <span className="text-sm text-slate-400">
                    {title}
                </span>

                <span className="font-semibold text-white text-right">
                    {value}
                </span>

            </div>

            {safePercent !== undefined && (

                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">

                    <div
                        className={`
                            ${color}
                            h-full
                            rounded-full
                            transition-all
                            duration-500
                        `}
                        style={{
                            width: `${safePercent}%`
                        }}
                    />

                </div>

            )}

        </div>
    );
}

// ==================================================
// Mode formatting
// ==================================================

function formatMode(mode: string) {

    switch (mode) {

        case "healthy":
            return "HEALTHY";

        case "alzheimer":
            return "ALZHEIMER'S";

        case "chip":
            return "CHIP TREATMENT";

        default:
            return mode.toUpperCase();
    }
}