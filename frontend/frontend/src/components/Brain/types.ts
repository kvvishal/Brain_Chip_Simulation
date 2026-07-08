import * as THREE from "three";

export interface BrainRegion{

    id:number;

    name:string;

    position:THREE.Vector3;

    activity:number;

}

export interface BrainConnection{

    source:number;

    target:number;

    weight:number;

}