"use client";

import * as THREE from "three";
import { useMemo } from "react";

type Props = {
    start: THREE.Vector3;
    end: THREE.Vector3;
    weight: number;
    activity: number;
    connectionStrength: number;
};

export default function BrainConnection({

    start,
    end,
    weight,
    activity,
    connectionStrength

}: Props) {

    // ==========================================
    // Geometry
    // ==========================================

    const geometry = useMemo(() => {

        return new THREE.BufferGeometry().setFromPoints([
            start,
            end
        ]);

    }, [start, end]);

    // ==========================================
    // Connection length
    // ==========================================

    const length = start.distanceTo(end);

    /*
     * Long anatomical pathways should appear
     * slightly dimmer so they don't dominate
     * the visualization.
     */

    const lengthFactor =
        THREE.MathUtils.clamp(
            1 - length / 180,
            0.55,
            1
        );

    // ==========================================
    // Visual opacity
    // ==========================================

    const opacity = useMemo(() => {

        return THREE.MathUtils.clamp(

            (
                0.04 +
                activity * 0.25 +
                weight * 0.10
            ) *

            connectionStrength *

            lengthFactor,

            0.02,

            0.25

        );

    }, [
        activity,
        weight,
        connectionStrength,
        lengthFactor
    ]);

    // ==========================================
    // Healthy → Cyan
    // Alzheimer's → Dark blue
    // ==========================================

    const color = useMemo(() => {

        return new THREE.Color("#7DEBFF").lerp(

            new THREE.Color("#17324D"),

            1 - connectionStrength

        );

    }, [connectionStrength]);

    return (

        <line
            geometry={geometry}
            renderOrder={1}
        >

            <lineBasicMaterial

                color={color}

                transparent

                opacity={opacity}

                depthWrite={false}

                toneMapped={false}

            />

        </line>

    );

}