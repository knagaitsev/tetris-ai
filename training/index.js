var Population = require("./population.js");
var AI = require("./ai.js");

var dimensions = {
    width: 400,
    height: 800
};

//var population = new Population(dimensions);

var weights = {
    completedLinesMin: 0.7,
    completedLinesMax: 0.9,
    holes: 0.9,
    bumpiness: 0.3,
    rowsWithHoles: 0.4
};
var ai = new AI(dimensions, true, weights);
ai.maxPieceCount = undefined;
ai.logPiece1000 = true;
ai.play();
console.log("final score: " + ai.score);
console.log("piece count: " + ai.pieceCount);