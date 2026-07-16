"use client";

export default function EventLog() {

    return (

        <div className="bg-[#111827] rounded-xl h-full p-6">

            <h2 className="text-xl font-bold text-cyan-400 mb-5">

                Event Log

            </h2>

            <div className="space-y-3 text-sm">

                <p className="text-green-400">

                    ● Simulation Started

                </p>

                <p className="text-yellow-400">

                    ● Waiting...

                </p>

            </div>

        </div>

    );

}