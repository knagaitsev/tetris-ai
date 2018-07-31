var Genetic = require("genetic-js");

class Population {
    constructor(canvas) {
        this.canvas = canvas;
        this.genetic = Genetic.create();

        var self = this;
        this.genetic.seed = function() {
            var canvas = this.userData.canvas;
            var AI = require("../../../ai.js");
            var r1 = Math.random();
            var r2 = Math.random();
            var ai = new AI(canvas, true, {
                completedLinesMin: Math.min(r1, r2),
                completedLinesMax: Math.max(r1, r2),
                holes: Math.random(),
                bumpiness: Math.random(),
                rowsWithHoles: Math.random()
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

        this.genetic.generation = function(pop, gen, stats) {
            // console.log(pop);
            // console.log(gen);
            // console.log(stats);
            var maxScore = 100000;
            if (pop[0].fitness >= maxScore) {
                return false;
            }
            return true;
        };

        this.genetic.notification = function(pop, gen, stats, isFinished) {
            var baseFilename = "data5";
            var filename = "data/" + baseFilename + ".json";
            var popFilename = "populations/" + baseFilename + ".json";
            var fs = require("fs");
            if (gen == 0) {
                fs.writeFileSync(filename, "[]");
                fs.writeFileSync(popFilename, "[]");
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

            var popData = JSON.parse(fs.readFileSync(popFilename, "utf8"));
            popData.push({
                generation: gen,
                population: pop,
                stats: stats
            });

            console.log("generation: " + gen + ", score: " + pop[0].fitness);
            fs.writeFileSync(filename, JSON.stringify(data, null, '\t'));

            fs.writeFileSync(popFilename, JSON.stringify(popData, null, '\t'));
        }

        var config = {
            webWorkers: true,
            size: 100,
            iterations: 100000,
            crossover: 0.8,
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