import { brainEngine } from "./BrainEngine";

class StatisticsEngine {

    averageActivity = 0;

    averageHealth = 0;

    damagedRegions = 0;

    healthyRegions = 0;

    stimulatedRegions = 0;

    update() {

        const total = brainEngine.getRegionCount();

        let activity = 0;
        let health = 0;

        let damaged = 0;
        let healthy = 0;
        let stimulated = 0;

        for (let i = 0; i < total; i++) {

            activity += brainEngine.getActivity(i);

            health += brainEngine.getHealth(i);

            if (brainEngine.getHealth(i) < 0.60)
                damaged++;

            else
                healthy++;

            if (brainEngine.isStimulated(i))
                stimulated++;

        }

        this.averageActivity = activity / total;

        this.averageHealth = health / total;

        this.damagedRegions = damaged;

        this.healthyRegions = healthy;

        this.stimulatedRegions = stimulated;

    }

    getBrainHealthScore() {

        return Math.round(

            this.averageHealth * 100
        )
    }

    getDiseaseStage(){

        const score = this.getBrainHealthScore();

            if (score > 90)
                return "Healthy";

            if (score > 75)
                return "Mild";

            if (score > 55)
                return "Moderate";

            if (score > 35)
                return "Severe";

            return "Critical";
    }

    getDiseasePercentage() {

    const regions = brainEngine.getRegions();

    if (regions.length === 0)

        return 0;

    const total = regions.reduce(

        (sum, r) => sum + r.disease,

        0

    );
        
    return (total / regions.length) * 100;

}
}

export const statisticsEngine =
new StatisticsEngine();