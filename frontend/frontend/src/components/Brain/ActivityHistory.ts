type ActivityPoint = {
    time: number;
    activity: number[];
};

class ActivityHistory {

    private history: ActivityPoint[] = [];

    private readonly MAX_POINTS = 300;

    add(activity: number[]) {

        this.history.push({

            time: performance.now(),

            activity: [...activity]

        });

        if (this.history.length > this.MAX_POINTS) {

            this.history.shift();

        }

    }

    getHistory() {

        return this.history;

    }

    clear() {

        this.history = [];

    }

}

export const activityHistory = new ActivityHistory();