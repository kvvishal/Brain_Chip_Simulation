import { brainEngine } from "./BrainEngine";

class BrainRegionSelector {

    getRegionGroup(keyword: string): number[] {

        return brainEngine
            .getRegions()
            .flatMap((region, index) =>
                region.name.includes(keyword)
                    ? [index]
                    : []
            );

    }

    private findHealthyRegion(): number {

        const regions = brainEngine.getRegions();

        return regions.findIndex(region =>

            !region.name.includes("HC") &&
            !region.name.includes("PHC") &&
            !region.name.includes("TC") &&
            !region.name.includes("PC") &&
            !region.name.includes("PFC") &&
            !region.name.includes("Amyg")

        );

    }

    getChartRegions() {

        return {

            hippocampus:
                this.getRegionGroup("HC"),

            temporal:
                this.getRegionGroup("TC"),

            parietal:
                this.getRegionGroup("PC"),

            frontal:
                this.getRegionGroup("PFC"),

            control:
                [this.findHealthyRegion()]

        };

    }

}

export const brainRegionSelector =
    new BrainRegionSelector();