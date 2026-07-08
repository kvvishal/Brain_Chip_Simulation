import * as THREE from "three";

class BrainPositionStore {

    private positions: THREE.Vector3[] = [];

    set(points: THREE.Vector3[]) {
        this.positions = points;
    }

    get() {
        return this.positions;
    }

}

export const brainPositionStore = new BrainPositionStore();