import * as THREE from "three";

const regions=[];

for(let i=0;i<96;i++){

    regions.push({

        id:i,

        activity:Math.random(),

        position:new THREE.Vector3(

            (Math.random()-0.5)*1.4,

            (Math.random()-0.5)*1.2,

            (Math.random()-0.5)*1.0

        )

    });

}

export default regions;