"use client";

import { ReactNode } from "react";

type Props = {

    title: string;

    color: string;

    value?: string;

    children: ReactNode;

};

export default function ChartCard({

    title,

    color,

    value,

    children

}: Props) {

    return (

        <div
            className="
                bg-[#111827]
                border
                border-slate-700
                rounded-xl
                h-full
                flex
                flex-col
                overflow-hidden
            "
        >

            <div
                className="
                    flex
                    justify-between
                    items-center
                    px-5
                    py-3
                    border-b
                    border-slate-700
                "
            >

                <div>

                    <p
                        className="text-lg font-semibold"
                        style={{ color }}
                    >

                        {title}

                    </p>

                    <p className="text-xs text-slate-500 mt-1">

                        ● LIVE

                    </p>

                </div>

                {

                    value && (

                        <p
                            className="text-2xl font-bold"
                            style={{ color }}
                        >

                            {value}

                        </p>

                    )

                }

            </div>

            <div className="flex-1 p-4">

                {children}

            </div>

        </div>

    );

}