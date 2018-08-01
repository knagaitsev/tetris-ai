// window.onload = function() {
//   const game = document.getElementById('game');
//   let score = 0;
//   const scoreElt = document.getElementById('score');
//   let level = 1;
//   const levelElt = document.getElementById('level');  
//   const context = game.getContext('2d');
//   const player = new Player(game);

//   let lastTime = 0;

//   function update(time = 0) {
//     context.clearRect(0, 0, game.width, game.height);

//     const deltaTime = time - lastTime;

//     player.draw();
//     player.updateTimer(deltaTime, callback);

//     lastTime = time;
//     requestAnimationFrame(update);
//   } 

//   update();

//   window.onkeydown = event => {
//     if (event.code === 'ArrowLeft') {
//       player.move(-1, 0);
//     } else if (event.code === 'ArrowRight') {
//       player.move(1, 0);
//     } else if (event.code === 'ArrowDown') {
//       player.moveDown(callback);
//     } else if (event.code === 'ArrowUp') {
//       player.rotate();
//     }
//   }

//   function callback(counter, colliding) {
//     console.log(score);
//     score += counter;
//     if (counter > 4) {
//       score = 0;
//       level++;
//       player.grid = new Grid(canvas.width / 50, canvas.height / 50);
//     }
//     if (colliding) {
//       score = 0;
//     }
//     scoreElt.innerHTML = score;
//     levelElt.innerHTML = level;    
//   }
// }

$(document).ready(function() {
  const game = document.getElementById('game');
  let score = 0;
  const scoreElt = document.getElementById('score');
  const context = game.getContext('2d');

  let lastTime = 0;
  var isAi = true;

  var showPlacements = false;
  var showPlacementsDelay = 35;

  var weights = {
    completedLinesMin: .491,
    completedLinesMax: 0.768,
    holes: 0.858,
    bumpiness: 0.393,
    rowsWithHoles: 0.871
};

  var player;

  function startAi(genWeights) {

    function initAi() {
      var weightsClone;
      if (genWeights) {
        weightsClone = genWeights;
      }
      else {
        weightsClone = JSON.parse(JSON.stringify(weights));
        Object.keys(weights).forEach(function(key, index) {
          var val = $("#" + key).val();
          if (val == "") {
            $("#" + key).val(weights[key]);
          }
          else {
            weightsClone[key] = parseFloat(val);
          }
        });
      }
      Object.keys(weightsClone).forEach(function(key, index) {
        weightsClone[key] = Math.round(weightsClone[key] * 4000) / 4000;
        $("#" + key).val(weightsClone[key]);
      });

      scoreElt.innerHTML = 0;
      isAi = true;
      player = new AI(game, false, weightsClone);
      if (showPlacements) {
        player.testMovesDelay = showPlacementsDelay;
      }
      else {
        player.testMovesDelay = 0;
      }
    }

    if (player && isAi) {
      player.reset(function() {
        initAi();
      });
    }
    else if (!player || !isAi) {
      initAi();
      (async function() {
        while (isAi) {
          player.resetGame();
          await player.playAsync();
        }
      })();
    }
    else if (!isAi) {
      initAi();
    }
  }

  function startNormal() {
    scoreElt.innerHTML = 0;
    isAi = false;
    player.reset(function() {
      player = new Player(game);
    });
  }

  window.onkeydown = function(event) {
    function callback(counter, colliding) {
      score += counter;
      if (colliding) {
        score = 0;
      }
      scoreElt.innerHTML = score;  
    }
    if (!isAi) {
      if (event.code === 'ArrowLeft') {
        player.move(-1, 0);
      } else if (event.code === 'ArrowRight') {
        player.move(1, 0);
      } else if (event.code === 'ArrowDown') {
        player.moveDown(callback);
      } else if (event.code === 'ArrowUp') {
        player.rotate();
      }
    }
  }

  $("form").submit(function(e) {
    e.preventDefault();
  });

  $("#play").click(function() {
    if (isAi) {
      $("#generation").text("Human!");
      $(this).val("Play AI");
      startNormal();
    }
    else {
      $("#generation").text("User defined");
      $(this).val("Play Yourself");
      startAi();
    }
  });

  $("#resetWeights").click(function() {
    $("#generation").text("User defined");
    $("#play").val("Play Yourself");
    startAi();
  });

  $("#generationSlider").on("input", function() {
    $("#resetGeneration").val("Reset to Generation: " + $(this).val());
  });

  function startAiFromGen(gen, cb) {
    $("#generation").text(gen);
    $.get("data/final.json", null, function(data) {
      startAi(data[gen].best.weights);
      if (cb) {
        cb();
      }
    }, "json");
  }

  $("#resetGeneration").click(function() {
    var gen = $("#generationSlider").val();
    startAiFromGen(gen);
  });

  $("#showPlacements").on("input", function() {
    showPlacements = $(this).prop("checked");

    if (isAi) {
      if (showPlacements) {
        player.testMovesDelay = showPlacementsDelay;
      }
      else {
        player.testMovesDelay = 0;
      }
    }
  });

  startAiFromGen(27, update);

  function update(time = 0) {

    context.clearRect(0, 0, game.width, game.height);

    const deltaTime = time - lastTime;

    player.draw();
    if (!isAi) {
      player.updateTimer(deltaTime, function(counter, colliding) {
        score += counter;
        if (colliding) {
          score = 0;
        }
        scoreElt.innerHTML = score;  
      });
    }

    lastTime = time;
    requestAnimationFrame(update);
  }
});