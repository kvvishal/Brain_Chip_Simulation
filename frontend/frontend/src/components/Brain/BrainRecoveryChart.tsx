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
import { recoveryHistory } from "./RecoveryHistory";
import ChartCard from "./ChartCard";

export default function BrainRecoveryChart() {

    const { version } = useBrain();

    void version;

    const data =
        recoveryHistory
            .getHistory()
            .map((point, index) => ({

                time: index,

                recovery: point.recovery

            }));

    return (

        <ChartCard

            title="Recovery Progress"

            color="#10B981"

            value={
                data.length
                    ? `${(
                        data[data.length - 1].recovery * 100
                    ).toFixed(1)}%`
                    : "--"
            }

        >

            <ResponsiveContainer width="100%" height="100%">

                <LineChart data={data}>

                    <CartesianGrid
                        stroke="#1E293B"
                        strokeDasharray="2 2"
                    />

                    <XAxis hide />

                    <YAxis
                        hide
                        domain={[0, 1]}
                    />

                    <Tooltip
                        formatter={(v: number) =>
                            `${(v * 100).toFixed(1)}%`
                        }
                        contentStyle={{
                            background: "#0F172A",
                            border: "1px solid #334155",
                            borderRadius: "8px"
                        }}
                    />

                    <Line
                        dataKey="recovery"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={false}
                    />

                </LineChart>

            </ResponsiveContainer>

        </ChartCard>

    );

}