"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";

type BrainContextType = {

    version:number;

    refresh:()=>void;

};

const BrainContext = createContext<BrainContextType|null>(null);

export function BrainProvider({

    children

}:{

    children:ReactNode

}){

    const [version,setVersion]=useState(0);

    function refresh(){

        setVersion(v=>v+1);

    }

    return(

        <BrainContext.Provider

            value={{

                version,

                refresh

            }}

        >

            {children}

        </BrainContext.Provider>

    );

}

export function useBrain(){

    const ctx=useContext(BrainContext);

    if(!ctx){

        throw new Error("BrainProvider missing");

    }

    return ctx;

}