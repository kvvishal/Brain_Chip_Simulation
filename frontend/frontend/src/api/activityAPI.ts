export async function loadActivity() {

    const response = await fetch(

        "http://127.0.0.1:5000/activity"

    );

    return await response.json();

}