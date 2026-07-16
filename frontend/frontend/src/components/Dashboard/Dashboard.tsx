"use client";

import BrainCanvas from "../Brain/BrainCanvas";
import StatusPanel from "./StatusPanel";
import BrainStatistics from "./BrainStatistics";
import EventLog from "./EventLog";

export default function Dashboard() {

    return (

        <div className="grid grid-cols-12 gap-6 h-full">

            {/* ================= Brain Viewer ================= */}

            <div className="col-span-8">

                <BrainCanvas />

            </div>

            {/* ================= Right Status ================= */}

            <div className="col-span-4">

                <StatusPanel />

            </div>

            {/* ================= Statistics ================= */}

            <div className="col-span-6">

                <BrainStatistics />

            </div>

            {/* ================= Event Log ================= */}

            <div className="col-span-6">

                <EventLog />

            </div>

        </div>

    );

}