import * as THREE from "three";

class BrainSampleStore {

    points: THREE.Vector3[] = [];

    set(points: THREE.Vector3[]) {

        this.points = points;

    }

    get() {

        return this.points;

    }

}

export default new BrainSampleStore();