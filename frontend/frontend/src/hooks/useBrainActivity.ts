"use client";

import { useEffect } from "react";
import BrainEngine from "@/components/Brain/BrainEngine";

export default function useBrainActivity(){

useEffect(()=>{

const timer=setInterval(async()=>{

const res=await fetch("http://127.0.0.1:5000/activity");

const data=await res.json();

BrainEngine.setActivity(data);

},50);

return()=>clearInterval(timer);

},[]);

}