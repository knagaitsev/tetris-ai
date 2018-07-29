var Population = require("./population.js");
var AI = require("./ai.js");

var dimensions = {
    width: 400,
    height: 800
};

//var population = new Population(dimensions);

var weights = {
    heightSum: 0.883,
    completedLines: 0.932,
    holes: 0.449,
    bumpiness: 0.306
};
var ai = new AI(dimensions, true, weights);
ai.maxPieceCount = undefined;
ai.play();
console.log("score: " + ai.score);
console.log("piece count: " + ai.pieceCount);