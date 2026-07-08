import * as THREE from "three";

export default class CoordinateMapper {

    private atlasMin = new THREE.Vector3();
    private atlasMax = new THREE.Vector3();

    private modelMin = new THREE.Vector3();
    private modelMax = new THREE.Vector3();
    private ready = false;

    initialize(
        atlasPoints: THREE.Vector3[],
        modelBox: THREE.Box3
    ){

        this.atlasMin.set(
            Infinity,
            Infinity,
            Infinity
        );

        this.atlasMax.set(
            -Infinity,
            -Infinity,
            -Infinity
        );

        atlasPoints.forEach((p)=>{

            this.atlasMin.min(p);
            this.atlasMax.max(p);

        });

        this.modelMin.copy(modelBox.min);
        this.modelMax.copy(modelBox.max);
        this.ready = true;
    }

    map(point:THREE.Vector3){

        if (!this.ready) {
            console.error("CoordinateMapper is not initialized");
            return new THREE.Vector3();
        }

        return new THREE.Vector3(

            THREE.MathUtils.mapLinear(

                point.x,

                this.atlasMin.x,
                this.atlasMax.x,

                this.modelMin.x,
                this.modelMax.x

            ),

            THREE.MathUtils.mapLinear(

                point.y,

                this.atlasMin.y,
                this.atlasMax.y,

                this.modelMin.y,
                this.modelMax.y

            ),

            THREE.MathUtils.mapLinear(

                point.z,

                this.atlasMin.z,
                this.atlasMax.z,

                this.modelMin.z,
                this.modelMax.z

            )

        );

    }

    isReady() {

    return this.ready;

    }

}