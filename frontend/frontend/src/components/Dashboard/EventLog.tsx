"use client";

import { useEffect, useRef, useState } from "react";

import { brainEngine } from "../Brain/BrainEngine";
import { brainSignalPropagation } from "../Brain/BrainSignalPropagation";

type LogType =
    | "healthy"
    | "disease"
    | "chip"
    | "recovery"
    | "info";

type LogEntry = {
    id: number;
    message: string;
    type: LogType;
    time: string;
};

export default function EventLog() {

    const [logs, setLogs] =
        useState<LogEntry[]>([]);

    /*
     * Previous simulation values.
     *
     * We compare these against the current
     * engine state to detect changes.
     */

    const previousMode =
        useRef<string | null>(null);

    const previousChipState =
        useRef(false);

    const previousActiveRegions =
        useRef(0);

    const previousInfectedRegions =
        useRef(0);

    const previousHealthyRegions =
        useRef(0);

    // ==========================================
    // ADD EVENT
    // ==========================================

    function addLog(
        message: string,
        type: LogType
    ) {

        const entry: LogEntry = {

            id:
                Date.now() +
                Math.random(),

            message,

            type,

            time:
                new Date()
                    .toLocaleTimeString()

        };

        setLogs(previous => {

            /*
             * Keep dashboard lightweight.
             *
             * We only display the latest
             * 30 simulation events.
             */

            return [
                entry,
                ...previous
            ].slice(0, 30);

        });
    }

    // ==========================================
    // WATCH SIMULATION
    // ==========================================

    useEffect(() => {

        const interval =
            window.setInterval(() => {

                const regions =
                    brainEngine.getRegions();

                if (
                    regions.length === 0
                ) {
                    return;
                }

                const mode =
                    brainEngine.getMode();

                const chipActive =
                    brainEngine.isChipActive();

                const activeTreatment =
                    brainSignalPropagation
                        .getActiveRegionCount();

                const infected =
                    regions.filter(region =>
                        region.infected ||
                        region.disease > 0.01
                    ).length;

                const healthy =
                    regions.filter(region =>

                        region.disease <= 0.01 &&

                        region.health >= 0.90 &&

                        region.activity >= 0.90

                    ).length;

                // ======================================
                // MODE CHANGE
                // ======================================

                if (
                    previousMode.current !==
                    mode
                ) {

                    if (
                        mode === "healthy"
                    ) {

                        addLog(
                            "Healthy brain simulation loaded",
                            "healthy"
                        );

                    }

                    else if (
                        mode === "alzheimer"
                    ) {

                        addLog(
                            "Alzheimer's disease simulation activated",
                            "disease"
                        );

                    }

                    else if (
                        mode === "chip"
                    ) {

                        addLog(
                            "Brain chip treatment mode activated",
                            "chip"
                        );

                    }

                    previousMode.current =
                        mode;
                }

                // ======================================
                // CHIP ACTIVATION / DEACTIVATION
                // ======================================

                if (
                    chipActive !==
                    previousChipState.current
                ) {

                    if (chipActive) {

                        addLog(
                            "Neural chip activated",
                            "chip"
                        );

                    }

                    else if (
                        previousChipState.current
                    ) {

                        addLog(
                            "Neural chip deactivated",
                            "info"
                        );

                    }

                    previousChipState.current =
                        chipActive;
                }

                // ======================================
                // DISEASE SPREAD
                // ======================================

                if (
                    infected >
                    previousInfectedRegions.current
                ) {

                    const difference =
                        infected -
                        previousInfectedRegions.current;

                    addLog(
                        `Disease spread to ${difference} new region${
                            difference === 1
                                ? ""
                                : "s"
                        }`,
                        "disease"
                    );

                }

                previousInfectedRegions.current =
                    infected;

                // ======================================
                // CHIP PROPAGATION
                // ======================================

                if (
                    chipActive &&
                    activeTreatment >
                    previousActiveRegions.current
                ) {

                    const difference =
                        activeTreatment -
                        previousActiveRegions.current;

                    addLog(
                        `Chip stimulation reached ${difference} new region${
                            difference === 1
                                ? ""
                                : "s"
                        }`,
                        "chip"
                    );

                }

                // ======================================
                // TREATMENT COMPLETION
                // ======================================

                if (
                    chipActive &&
                    activeTreatment <
                    previousActiveRegions.current
                ) {

                    const recovered =
                        previousActiveRegions.current -
                        activeTreatment;

                    addLog(
                        `${recovered} region${
                            recovered === 1
                                ? ""
                                : "s"
                        } completed treatment`,
                        "recovery"
                    );

                }

                previousActiveRegions.current =
                    activeTreatment;

                // ======================================
                // FUNCTIONAL RECOVERY
                // ======================================

                if (
                    healthy >
                    previousHealthyRegions.current
                ) {

                    const difference =
                        healthy -
                        previousHealthyRegions.current;

                    /*
                     * Avoid reporting initial healthy
                     * brain creation as "recovery".
                     */

                    if (
                        mode === "chip"
                    ) {

                        addLog(
                            `${difference} region${
                                difference === 1
                                    ? ""
                                    : "s"
                            } functionally recovered`,
                            "recovery"
                        );

                    }

                }

                previousHealthyRegions.current =
                    healthy;

            }, 500);

        return () => {

            window.clearInterval(
                interval
            );

        };

    }, []);

    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="bg-[#111827] rounded-xl h-full p-6">

            <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-bold text-cyan-400">
                    Event Log
                </h2>

                <span className="text-xs text-slate-500">
                    LIVE
                </span>

            </div>

            <div
                className="
                    space-y-3
                    text-sm
                    max-h-72
                    overflow-y-auto
                    pr-2
                "
            >

                {logs.length === 0 ? (

                    <p className="text-slate-500">
                        Waiting for simulation events...
                    </p>

                ) : (

                    logs.map(log => (

                        <div
                            key={log.id}
                            className="
                                flex
                                gap-3
                                border-b
                                border-slate-800
                                pb-2
                            "
                        >

                            <span
                                className={
                                    getLogColor(
                                        log.type
                                    )
                                }
                            >
                                ●
                            </span>

                            <div className="flex-1">

                                <p className="text-slate-300">
                                    {log.message}
                                </p>

                                <p className="text-xs text-slate-600 mt-1">
                                    {log.time}
                                </p>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );
}


// ==================================================
// EVENT COLOR
// ==================================================

function getLogColor(
    type: LogType
) {

    switch (type) {

        case "healthy":
            return "text-green-400";

        case "disease":
            return "text-red-400";

        case "chip":
            return "text-cyan-400";

        case "recovery":
            return "text-emerald-400";

        default:
            return "text-yellow-400";
    }
}