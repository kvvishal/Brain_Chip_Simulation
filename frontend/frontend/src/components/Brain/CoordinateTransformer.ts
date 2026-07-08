import * as THREE from "three";

class CoordinateTransformer {

    private atlasMin = new THREE.Vector3();
    private atlasMax = new THREE.Vector3();

    private modelBox = new THREE.Box3();

    private ready = false;

    initialize(
        atlasPoints: THREE.Vector3[],
        modelBox: THREE.Box3
    ) {

        this.modelBox.copy(modelBox);

        this.atlasMin.set(Infinity, Infinity, Infinity);
        this.atlasMax.set(-Infinity, -Infinity, -Infinity);

        atlasPoints.forEach((p) => {

            this.atlasMin.min(p);
            this.atlasMax.max(p);

        });

        this.ready = true;
    }

    isReady() {

        return this.ready;

    }

    transform(point: THREE.Vector3) {

        const atlasSize = new THREE.Vector3().subVectors(
            this.atlasMax,
            this.atlasMin
        );

        const modelSize = this.modelBox.getSize(new THREE.Vector3());

        return new THREE.Vector3(

            this.modelBox.min.x +
                ((point.x - this.atlasMin.x) / atlasSize.x) * modelSize.x,

            this.modelBox.min.y +
                ((point.y - this.atlasMin.y) / atlasSize.y) * modelSize.y,

            this.modelBox.min.z +
                ((point.z - this.atlasMin.z) / atlasSize.z) * modelSize.z

        );

    }

}

export const coordinateTransformer = new CoordinateTransformer();