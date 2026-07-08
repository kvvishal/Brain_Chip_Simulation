class SimulationManager {

    private mode = "healthy";

    private playing = false;

    private speed = 1;

    play() {

        this.playing = true;

    }

    pause() {

        this.playing = false;

    }

    setSpeed(speed:number){

        this.speed = speed;

    }

    setMode(mode:string){

        this.mode = mode;

    }

    getMode(){

        return this.mode;

    }

    isPlaying(){

        return this.playing;

    }

}

export const simulationManager =
new SimulationManager();