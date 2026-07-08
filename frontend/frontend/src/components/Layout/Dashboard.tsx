"use client";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import BrainCanvas from "../Brain/BrainCanvas";

export default function Dashboard() {

    return (

        <>

            <LeftPanel/>

            <BrainCanvas/>

            <RightPanel/>

        </>

    );

}