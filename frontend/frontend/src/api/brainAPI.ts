import axios from "axios";

export async function loadRegions(){

    const res = await axios.get(
        "http://127.0.0.1:5000/brain_regions"
    );

    return res.data;

}