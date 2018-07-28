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

window.onload = function() {
  const game = document.getElementById('game');
  let score = 0;
  const scoreElt = document.getElementById('score');
  let level = 1;
  const levelElt = document.getElementById('level');  
  const context = game.getContext('2d');

  let lastTime = 0;

  var weights = {
    heightSum: Math.random(),
    completedLines: Math.random(),
    holes: Math.random(),
    bumpiness: Math.random()
  };

  const player = new AI(game, false, weights);
  (async function() {
    while (true) {
      await player.playAsync();
      player.resetGame();
    }
  })();

  function update(time = 0) {

    context.clearRect(0, 0, game.width, game.height);

    const deltaTime = time - lastTime;

    player.draw();
    player.updateTimer(deltaTime, function(counter, colliding) {});

    lastTime = time;
    requestAnimationFrame(update);
  } 

  update();

  // var population = new Population({
  //   width: game.width,
  //   height: game.height
  // });
}