"use client";

export default function Lights(){

return(

<>

<ambientLight intensity={0.8}/>

<directionalLight

position={[5,4,5]}

intensity={1.5}

/>

<directionalLight

position={[-5,-5,-5]}

intensity={0.5}

/>

<pointLight

position={[0,3,3]}

intensity={1}

/>

</>

);

}