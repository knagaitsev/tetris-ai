var Genetic = require("genetic-js");

class Population {
    constructor(canvas) {
        this.canvas = canvas;
        this.genetic = Genetic.create();

        var self = this;
        this.genetic.seed = function() {
            var canvas = this.userData.canvas;
            var AI = require("../../../ai.js");
            var ai = new AI(canvas, true, {
                heightSum: Math.random(),
                completedLines: Math.random(),
                holes: Math.random(),
                bumpiness: Math.random()
            });
            return ai;
        };

        this.genetic.fitness = function(individual) {
            var fitness = individual.determineFitness();
            //console.log(fitness);
            return fitness;
        };

        this.genetic.optimize = Genetic.Optimize.Maximize;
        this.genetic.select1 = Genetic.Select1.RandomLinearRank;
        this.genetic.select2 = Genetic.Select2.Tournament3;

        this.genetic.mutate = function(ai) {
            function mutation() {
                return Math.random() * 0.1 - 0.05;
            }
            var weights = ai.weights;
            var mutatedWeights = {};
            Object.keys(weights).forEach(function(key, index) {
                mutatedWeights[key] = weights[key] + mutation();
            });

            var AI = require("../../../ai.js");
            var mutatedAi = new AI(ai.canvas, true, mutatedWeights);

            return mutatedAi;
        };

        this.genetic.crossover = function(mother, father) {
            var AI = require("../../../ai.js");
            function lerp(a, b, p) {
                return a + (b-a)*p;
            }

            var motherWeights = mother.weights;
            var len = Object.keys(motherWeights).length;
            var i = Math.floor(Math.random()*len);
            var r = Math.random();
            var fatherWeights = father.weights;
            var daughterWeights = {};
            var sonWeights = {};

            Object.keys(motherWeights).forEach(function(key, index) {
                var weight = motherWeights[key];
                if (index == i) {
                    weight = lerp(motherWeights[key], fatherWeights[key], r);
                }
                daughterWeights[key] = weight;
            });

            Object.keys(fatherWeights).forEach(function(key, index) {
                var weight = fatherWeights[key];
                if (index == i) {
                    weight = lerp(fatherWeights[key], motherWeights[key], r);
                }
                sonWeights[key] = weight;
            });

            var daughter = new AI(mother.canvas, true, daughterWeights);
            var son = new AI(father.canvas, true, sonWeights);

            return [son, daughter];
        }

        // this.genetic.generation = function(pop, gen, stats) {
        //     console.log(pop);
        //     console.log(gen);
        //     console.log(stats);
        //     return true;
        // };

        this.genetic.notification = function(pop, gen, stats, isFinished) {
            var filename = "data/data1.json";
            var fs = require("fs");
            if (gen == 0) {
                fs.writeFileSync(filename, "[]");
            }
            var data = JSON.parse(fs.readFileSync(filename, "utf8"));
            data.push({
                generation: gen,
                best: {
                    fitness: pop[0].fitness,
                    weights: pop[0].entity.weights
                },
                stats: stats
            });
            console.log(gen);
            fs.writeFileSync(filename, JSON.stringify(data, null, '\t'));
        }

        var config = {
            webWorkers: false,
            size: 250,
            iterations: 1000,
            crossover: 0.9,
            mutation: 0.2,
            fittestAlwaysSurvives: true
        };
        var userData = {
            canvas: this.canvas
        };

        this.genetic.evolve(config, userData);

    }
}

module.exports = Population;