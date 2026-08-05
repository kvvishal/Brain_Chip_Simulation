type HealthPoint = {

    time: number;

    health: number;

};

class HealthHistory {

    private history: HealthPoint[] = [];

    private readonly MAX_POINTS = 300;

    add(health: number) {

        this.history.push({

            time: performance.now(),

            health

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

export const healthHistory =
    new HealthHistory();