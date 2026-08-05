"use client";

import {

    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid

} from "recharts";

import { useBrain } from "./BrainContext";
import { healthHistory } from "./HealthHistory";
import ChartCard from "./ChartCard";

export default function BrainHealthChart() {

    const { version } = useBrain();

    void version;

    const data =
        healthHistory
            .getHistory()
            .map((point, index) => ({

                time: index,

                health: point.health

            }));

    return (

        <ChartCard

            title="Brain Health"

            color="#22C55E"

            value={
                data.length
                    ? `${(
                        data[data.length - 1].health * 100
                    ).toFixed(1)}%`
                    : "--"
            }

        >

            <ResponsiveContainer
                width="100%"
                height="100%"
            >

                <LineChart data={data}>

                    <CartesianGrid
                        stroke="#1E293B"
                        strokeDasharray="2 2"
                    />

                    <XAxis
                        hide
                        dataKey="time"
                    />

                    <YAxis
                        hide
                        domain={[0, 1]}
                    />

                    <Tooltip
                        formatter={(value: number) =>
                            `${(value * 100).toFixed(1)}%`
                        }
                        contentStyle={{
                            background: "#0F172A",
                            border: "1px solid #334155",
                            borderRadius: "8px"
                        }}
                    />

                    <Line

                        type="monotone"

                        dataKey="health"

                        stroke="#22C55E"

                        strokeWidth={3}

                        dot={false}

                        isAnimationActive={false}

                    />

                </LineChart>

            </ResponsiveContainer>

        </ChartCard>

);

}