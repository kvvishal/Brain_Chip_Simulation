"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode
} from "react";

type BrainContextType = {

    version: number;

    refresh: () => void;

};

const BrainContext =
    createContext<BrainContextType | null>(
        null
    );

export function BrainProvider({

    children

}: {

    children: ReactNode;

}) {

    const [version, setVersion] =
        useState(0);

    // ==================================================
    // Manual refresh
    // ==================================================

    const refresh =
        useCallback(() => {

            setVersion(
                value => value + 1
            );

        }, []);

    // ==================================================
    // Simulation -> React synchronization
    // ==================================================

    useEffect(() => {

        /*
         * BrainEngine and the simulation engines mutate
         * objects outside React.
         *
         * React therefore does not know when:
         *
         * - disease spreads
         * - health decreases
         * - neural activity changes
         * - chip propagation occurs
         * - recovery occurs
         *
         * This timer gives dashboard components a
         * lightweight update signal.
         */

        const interval =
            window.setInterval(() => {

                setVersion(
                    value => value + 1
                );

            }, 250);

        return () => {

            window.clearInterval(
                interval
            );

        };

    }, []);

    return (

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

export function useBrain() {

    const ctx =
        useContext(BrainContext);

    if (!ctx) {

        throw new Error(
            "BrainProvider missing"
        );

    }

    return ctx;

}