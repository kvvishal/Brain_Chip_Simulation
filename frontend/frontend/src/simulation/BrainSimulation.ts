export class BrainSimulation {

    private activity:number[]=[];

    constructor(nodes:number){

        this.activity=new Array(nodes).fill(0);

    }

    update(){

        this.activity=this.activity.map(()=>Math.random());

    }

    getActivity(){

        return this.activity;

    }

}