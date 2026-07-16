import { brainEngine } from "./BrainEngine";

class RecoveryEngine {

    private recoveryRate = 0.0015;

    update() {

        if (!brainEngine.isChipActive())
            return;

        const count = brainEngine.getRegionCount();

        for (let i = 0; i < count; i++) {

            if (!brainEngine.isStimulated(i))
                continue;

            // Recover health
            const health = Math.min(
                brainEngine.getHealth(i) + this.recoveryRate,
                1
            );

            brainEngine.setHealth(i, health);

            // Normalize activity
            const activity = brainEngine.getActivity(i);

            const recoveredActivity =
                activity + (1 - activity) * 0.002;

            brainEngine.setActivity(
                i,
                Math.min(recoveredActivity, 1)
            );

            // Reduce disease level
            const region = brainEngine.getRegion(i);

            region.disease = Math.max(
                0,
                region.disease - 0.001
            );

        }

    }

    getRecoveryPercentage(): number {

        let total = 0;

        const count = brainEngine.getRegionCount();

        for (let i = 0; i < count; i++) {

            total += brainEngine.getHealth(i);

        }

        return (total / count) * 100;

    }

}

export const recoveryEngine =
    new RecoveryEngine();