import { brainEngine } from "./BrainEngine";

class BrainRegionSelector {

    findRegion(keyword: string): number {

        const regions = brainEngine.getRegions();

        return regions.findIndex(r =>
            r.name.includes(keyword)
        );

    }

    getChartRegions() {

        return {

            hippocampus:
                this.findRegion("HC"),

            temporal:
                this.findRegion("TC"),

            parietal:
                this.findRegion("PC"),

            frontal:
                this.findRegion("PFC"),

            control:
                this.findHealthyRegion()

        };

    }

    private findHealthyRegion() {

        const regions = brainEngine.getRegions();

        return regions.findIndex(r =>

            !r.name.includes("HC") &&

            !r.name.includes("TC") &&

            !r.name.includes("PC") &&

            !r.name.includes("PFC")

        );

    }

}

export const brainRegionSelector =
    new BrainRegionSelector();