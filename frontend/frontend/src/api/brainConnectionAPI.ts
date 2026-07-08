import axios from "axios";

export async function loadConnections() {

    const res = await axios.get(
        "http://127.0.0.1:5000/brain_connections"
    );

    console.log(res.data);

    return res.data;               // ✅ Correct

}