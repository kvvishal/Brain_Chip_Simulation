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

export default function BrainActivityChart() {

    // Subscribe to BrainContext so the chart
    // re-renders whenever refresh() is called.

    const { refresh } = useBrain();

    void refresh;

    const history = activityHistory.getHistory();

    const selected =
        brainRegionSelector.getChartRegions();

    const {
        hippocampus,
        temporal,
        parietal,
        frontal,
        control
    } = selected;

    const data = history.map((point, index) => ({

        time: index,

        Region0: point.activity[0],

        Region20: point.activity[20],

        Region40: point.activity[40],

        Region60: point.activity[60],

        Region80: point.activity[80]

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
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    axisLine={{ stroke: "#475569" }}
                    tickLine={{ stroke: "#475569" }}
                />

                <YAxis
                    domain={[0, 1]}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    axisLine={{ stroke: "#475569" }}
                    tickLine={{ stroke: "#475569" }}
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
                    type="monotone"
                    dataKey="Region0"
                    stroke="#00E5FF"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="Region20"
                    stroke="#00FF7F"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="Region40"
                    stroke="#FF00FF"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="Region60"
                    stroke="#FFD700"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

                <Line
                    type="monotone"
                    dataKey="Region80"
                    stroke="#FF4040"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                />

            </LineChart>

        </ResponsiveContainer>

    );

}