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
import { diseaseHistory } from "./DiseaseHistory";
import ChartCard from "./ChartCard";

export default function BrainDiseaseChart() {

    const { version } = useBrain();

    void version;

    const data =
        diseaseHistory
            .getHistory()
            .map((point, index) => ({

                time: index,

                disease: point.disease

            }));

    return (

        <ChartCard

            title="Disease Severity"

            color="#EF4444"

            value={
                data.length
                    ? `${(
                        data[data.length - 1].disease * 100
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
                        dataKey="disease"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={false}
                    />

                </LineChart>

            </ResponsiveContainer>

        </ChartCard>

    );

}