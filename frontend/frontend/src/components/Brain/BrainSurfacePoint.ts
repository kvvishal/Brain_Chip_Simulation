import * as THREE from "three";

export function samplePoints(mesh: THREE.Mesh, count = 96) {

    const positions =
        mesh.geometry.attributes.position.array;

    const points: THREE.Vector3[] = [];

    const used = new Set<number>();

    while (points.length < count) {

        const i =
            Math.floor(Math.random() * (positions.length / 3));

        if (used.has(i))
            continue;

        used.add(i);

        points.push(

            new THREE.Vector3(

                positions[i * 3],

                positions[i * 3 + 1],

                positions[i * 3 + 2]

            )

        );

    }

    return points;

}