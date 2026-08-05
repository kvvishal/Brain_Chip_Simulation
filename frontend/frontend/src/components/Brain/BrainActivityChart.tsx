"use client";

import {

    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend

} from "recharts";

import { useBrain } from "./BrainContext";
import { activityHistory } from "./ActivityHistory";
import { brainRegionSelector } from "./BrainRegionSelector";

// ==================================================
// Average activity of a brain region group
// ==================================================

function averageActivity(
    indices: number[],
    activity: number[]
): number | null {

    if (indices.length === 0) {
        return null;
    }

    const values = indices
        .map(index => activity[index])
        .filter(value => value !== undefined);

    if (values.length === 0) {
        return null;
    }

    const total =
        values.reduce(
            (sum, value) => sum + value,
            0
        );

    return total / values.length;
}

export default function BrainActivityChart() {

    const { version } = useBrain();

    void version;

    const history =
        activityHistory.getHistory();

    const {

        hippocampus,

        temporal,

        parietal,

        frontal,

        control

    } = brainRegionSelector.getChartRegions();

    const data =
        history.map((point, index) => ({

            time: index,

            Hippocampus:
                averageActivity(
                    hippocampus,
                    point.activity
                ),

            Temporal:
                averageActivity(
                    temporal,
                    point.activity
                ),

            Parietal:
                averageActivity(
                    parietal,
                    point.activity
                ),

            Frontal:
                averageActivity(
                    frontal,
                    point.activity
                ),

            Control:
                averageActivity(
                    control,
                    point.activity
                )

        }));

    return (

        <ResponsiveContainer
            width="100%"
            height="100%"
        >

            <LineChart

                data={data}

                margin={{

                    top: 10,

                    right: 20,

                    left: 0,

                    bottom: 0

                }}

            >

                <CartesianGrid

                    stroke="#243244"

                    strokeDasharray="3 3"

                />

                <XAxis

                    dataKey="time"

                    tick={{
                        fill: "#94A3B8",
                        fontSize: 12
                    }}

                    axisLine={{
                        stroke: "#475569"
                    }}

                    tickLine={{
                        stroke: "#475569"
                    }}

                />

                <YAxis

                    domain={[0, 1]}

                    tick={{
                        fill: "#94A3B8",
                        fontSize: 12
                    }}

                    axisLine={{
                        stroke: "#475569"
                    }}

                    tickLine={{
                        stroke: "#475569"
                    }}

                />

                <Tooltip

                    contentStyle={{

                        background: "#111827",

                        border: "1px solid #334155",

                        color: "#fff"

                    }}

                />

                <Legend />

                <Line

                    type="natural"

                    dataKey="Hippocampus"

                    stroke="#FF4040"

                    strokeWidth={2}

                    dot={false}

                    isAnimationActive={false}

                />

                <Line

                    type="natural"

                    dataKey="Temporal"

                    stroke="#00FF7F"

                    strokeWidth={2}

                    dot={false}

                    isAnimationActive={false}

                />

                <Line

                    type="natural"

                    dataKey="Parietal"

                    stroke="#FFD700"

                    strokeWidth={2}

                    dot={false}

                    isAnimationActive={false}

                />

                <Line

                    type="natural"

                    dataKey="Frontal"

                    stroke="#00E5FF"

                    strokeWidth={2}

                    dot={false}

                    isAnimationActive={false}

                />

                <Line

                    type="natural"

                    dataKey="Control"

                    stroke="#FF00FF"

                    strokeWidth={2}

                    dot={false}

                    isAnimationActive={false}

                />

            </LineChart>

        </ResponsiveContainer>

    );

}