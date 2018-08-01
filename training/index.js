var Population = require("./population.js");
var AI = require("./ai.js");

//const addon = require('./build/Release/addon');

// var grid = new addon.Grid(3, 5);
// grid.setPosition(0, 2, 1);

// grid.setPosition(0, 3, 1);
// grid.setPosition(1, 3, 1);
// grid.setPosition(2, 3, 1);

// grid.setPosition(0, 4, 1);
// grid.setPosition(1, 4, 1);
// grid.setPosition(2, 4, 1);

// console.log(grid.getRowsWithHoles());

// var gridData = grid.getGrid();
// gridData.forEach(function(row, index) {
//     console.log(row);
// });

var dimensions = {
    width: 400,
    height: 800
};

//var population = new Population(dimensions);

var weights = {
    "completedLinesMin": 0.5500,
    "completedLinesMax": 0.7806,
    "holes": 0.8208,
    "bumpiness": 0.3924,
    "rowsWithHoles": 0.8810
};
var ai = new AI(dimensions, true, weights);
ai.maxPieceCount = undefined;
var time = Date.now();
var fitness = ai.determineFitness();
var newTime = Date.now();
var elapsedTime = newTime - time;
console.log("time: " + elapsedTime);
console.log("fitness: " + fitness);