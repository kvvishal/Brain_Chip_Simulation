"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

import { brainEngine } from "./BrainEngine";

type Props = {
    source: number;
    target: number;
    start: THREE.Vector3;
    end: THREE.Vector3;

    speed?: number;
    color: string;

    // Normal brain signal or chip-generated signal
    type?: "biological" | "chip";
};

export default function BrainSignal({

    source,
    target,
    start,
    end,

    speed = 0.4,

    color,

    type = "biological"

}: Props) {

    const mesh = useRef<THREE.Mesh>(null);

    /*
     * Every signal begins at a different point.
     * This prevents all signals from moving together.
     */
    const offset = useRef(Math.random());

    /*
     * Stable value used for Alzheimer's pathway failure.
     *
     * Important:
     * Do NOT use Math.random() every frame.
     * Otherwise signals flicker randomly.
     */
    const failureValue = useRef(
        Math.random()
    );

    useFrame(({ clock }) => {

        if (!mesh.current)
            return;

        // Brain may not have initialized yet
        if (
            source >= brainEngine.getRegionCount() ||
            target >= brainEngine.getRegionCount()
        ) {

            mesh.current.visible = false;

            return;
        }

        const sourceState =
            brainEngine.getRegion(source);

        const targetState =
            brainEngine.getRegion(target);

        const mode =
            brainEngine.getMode();

        // ----------------------------------------
        // CHIP SIGNAL
        // ----------------------------------------

        if (type === "chip") {

            /*
             * Chip signals must only exist
             * while chip mode is active.
             */

            if (
                mode !== "chip" ||
                !brainEngine.isChipActive()
            ) {

                mesh.current.visible = false;

                return;
            }

            mesh.current.visible = true;

            const chipSpeed = 0.75;

            const t =
                (
                    clock.elapsedTime *
                    chipSpeed +
                    offset.current
                ) % 1;

            mesh.current.position.lerpVectors(
                start,
                end,
                t
            );

            /*
             * Strong pulse effect for chip signals
             */

            const pulse =
                1.25 +
                Math.sin(
                    clock.elapsedTime * 25
                ) * 0.35;

            mesh.current.scale.setScalar(
                pulse
            );

            return;
        }

        // ----------------------------------------
        // BIOLOGICAL SIGNAL
        // ----------------------------------------

        let currentSpeed = speed;

        let visible = true;

        /*
         * Disease severity for this pathway.
         *
         * If either side is badly damaged,
         * communication through the pathway
         * becomes impaired.
         */

        const disease =
            Math.max(
                sourceState.disease,
                targetState.disease
            );

        // ----------------------------------------
        // HEALTHY MODE
        // ----------------------------------------

        if (mode === "healthy") {

            currentSpeed = 0.45;

            visible = true;

        }

        // ----------------------------------------
        // ALZHEIMER'S MODE
        // ----------------------------------------

        else if (mode === "alzheimer") {

            /*
             * Stage 1
             * Mild disease
             */

            if (disease < 0.25) {

                currentSpeed = 0.38;

            }

            /*
             * Stage 2
             * Communication begins slowing
             */

            else if (disease < 0.50) {

                currentSpeed = 0.25;

            }

            /*
             * Stage 3
             * Severe impairment
             */

            else if (disease < 0.75) {

                currentSpeed = 0.12;

                /*
                 * Some pathways fail completely.
                 *
                 * failureValue is stable, therefore
                 * the same pathway stays failed.
                 */

                if (
                    failureValue.current < 0.35
                ) {

                    visible = false;

                }

            }

            /*
             * Stage 4
             * Major pathway failure
             */

            else {

                currentSpeed = 0.06;

                if (
                    failureValue.current < 0.75
                ) {

                    visible = false;

                }

            }

        }

        // ----------------------------------------
        // CHIP MODE
        // ----------------------------------------

        else if (mode === "chip") {

            /*
             * Biological signals remain damaged.
             *
             * This is important because we want
             * cyan chip signals to visually show
             * the additional artificial pathway.
             */

            if (disease < 0.25) {

                currentSpeed = 0.38;

            }

            else if (disease < 0.50) {

                currentSpeed = 0.25;

            }

            else if (disease < 0.75) {

                currentSpeed = 0.12;

                if (
                    failureValue.current < 0.35
                ) {

                    visible = false;

                }

            }

            else {

                currentSpeed = 0.06;

                if (
                    failureValue.current < 0.75
                ) {

                    visible = false;

                }

            }

        }

        mesh.current.visible =
            visible;

        if (!visible)
            return;

        // ----------------------------------------
        // Move signal
        // ----------------------------------------

        const t =
            (
                clock.elapsedTime *
                currentSpeed +
                offset.current
            ) % 1;

        mesh.current.position.lerpVectors(
            start,
            end,
            t
        );

        // ----------------------------------------
        // Pulse
        // ----------------------------------------

        const pulse =
            1 +
            Math.sin(
                clock.elapsedTime * 20
            ) * 0.25;

        /*
         * Diseased signals also become
         * slightly smaller.
         */

        const diseaseScale =
            Math.max(
                0.45,
                1 - disease * 0.45
            );

        mesh.current.scale.setScalar(
            pulse * diseaseScale
        );

    });

    // --------------------------------------------
    // Material
    // --------------------------------------------

    const signalColor =
        type === "chip"
            ? "#00FFFF"
            : color;

    const opacity =
        type === "chip"
            ? 1
            : Math.max(
                0.2,
                1 - Math.max(
                    brainEngine.getRegion(source).disease,
                    brainEngine.getRegion(target).disease
                ) * 0.8
            );

    return (

        <mesh
            ref={mesh}
            renderOrder={15}
        >

            <sphereGeometry
                args={[
                    type === "chip"
                        ? 0.022
                        : 0.018,
                    12,
                    12
                ]}
            />

            <meshBasicMaterial

                color={signalColor}

                toneMapped={false}

                transparent

                opacity={opacity}

                depthWrite={false}

            />

        </mesh>

    );

}