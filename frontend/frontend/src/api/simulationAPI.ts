const API = "http://127.0.0.1:5000";

export async function getSimulationInfo() {

    const res = await fetch(`${API}/simulation/info`);

    return res.json();

}

export async function getSimulationFrame(frame: number) {

    const res = await fetch(

        `${API}/simulation/frame/${frame}`

    );

    return res.json();

}

export async function getSimulation() {
    
    const res = await fetch(

        "http://127.0.0.1:5000/simulation/all"
    );

    return res.json();
}