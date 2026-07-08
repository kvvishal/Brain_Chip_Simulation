export function activityColor(value:number){

    if(value<0.2)
        return "#0066ff";

    if(value<0.4)
        return "#00ff99";

    if(value<0.6)
        return "#ffff00";

    if(value<0.8)
        return "#ff8800";

    return "#ff0000";

}