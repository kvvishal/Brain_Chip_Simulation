type RecoveryPoint = {

    time: number;

    recovery: number;

};

class RecoveryHistory {

    private history: RecoveryPoint[] = [];

    private readonly MAX_POINTS = 300;

    add(recovery: number) {

        this.history.push({

            time: performance.now(),

            recovery

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

export const recoveryHistory =
    new RecoveryHistory();