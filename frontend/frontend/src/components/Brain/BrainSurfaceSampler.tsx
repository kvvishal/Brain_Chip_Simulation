import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

export function sampleSurface(mesh: THREE.Mesh, count = 96) {

    const sampler = new MeshSurfaceSampler(mesh).build();

    const temp = new THREE.Vector3();

    const result: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {

        sampler.sample(temp);

        result.push(temp.clone());

    }

    return result;
}