import { BrainRegionState } from "./BrainRegionState";

export interface BrainState {

    regions: BrainRegionState[];

    currentFrame: number;

    simulationTime: number;

    mode:
        | "healthy"
        | "alzheimer"
        | "chip";

    playing: boolean;

    speed: number;

}