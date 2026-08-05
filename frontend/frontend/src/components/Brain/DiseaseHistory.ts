type DiseasePoint = {

    time: number;

    disease: number;

};

class DiseaseHistory {

    private history: DiseasePoint[] = [];

    private readonly MAX_POINTS = 300;

    add(disease: number) {

        this.history.push({

            time: performance.now(),

            disease

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

export const diseaseHistory =
    new DiseaseHistory();