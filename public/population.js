class Population {
    constructor(canvas) {
        this.canvas = canvas;
        this.genetic = Genetic.create();

        var self = this;
        this.genetic.seed = function() {
            var canvas = this.userData.canvas;
            var ai = new AI(canvas, true, {
                heightSum: Math.random(),
                completedLines: Math.random(),
                holes: Math.random(),
                bumpiness: Math.random()
            });
            return ai;
        };

        this.genetic.fitness = function(individual) {
            return individual.fitness;
        };

        this.genetic.optimize = Genetic.Optimize.Maximize;
        this.genetic.select1 = Genetic.Select1.RandomLinearRank;

        this.genetic.mutate = function(ai) {
            function mutation() {
                return Math.random() * 0.1 - 0.05;
            }
            var weights = ai.weights;
            var mutatedWeights = {};
            Object.keys(weights).forEach(function(key, index) {
                mutatedWeights[key] = weights[key] + mutation();
            });

            var mutatedAi = new AI(ai.canvas, true, mutatedWeights);

            return mutatedAi;
        };

        // this.genetic.generation = function(pop, gen, stats) {
        //     console.log(pop);
        //     console.log(gen);
        //     console.log(stats);
        //     return true;
        // };

        this.genetic.notification = function(pop, gen, stats, isFinished) {
            console.log(pop);
            console.log(gen);
            console.log(stats);
            console.log(isFinished);
        }

        var config = {
            webWorkers: false
        };
        var userData = {
            canvas: this.canvas
        };

        this.genetic.evolve(config, userData);

    }
}