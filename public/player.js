class Player {
  constructor(canvas) {
    this.PIECE_POOL = 'OISZLJT';
    this.COLORS = [
      null,
      'yellow',
      'cyan',
      'red',
      'green',
      'orange',
      'hotpink',
      'purple'];
    this.SIZE = 40;

    this.canvas = canvas;
    if(this.canvas.id) {
      this.context = this.canvas.getContext("2d");
    }

    this.position = new Vec2(canvas.width / 2 - this.SIZE, 0);
    const index = Math.random() * this.PIECE_POOL.length | 0;
    this.piece = new Piece(this.PIECE_POOL.charAt(index));
    this.timer = 0;
    this.interval = 1000;
    this.grid = new Grid(canvas.width / this.SIZE, canvas.height / this.SIZE);
  }

  updateTimer(deltaTime, callback) {
    this.timer += deltaTime;
    if (this.timer > this.interval) {
      this.moveDown(callback);
    }
  }

  resetTimer() {
    this.timer = 0;
  }

  move(x, y) {
    var success = true;
    this.position.x += x * this.SIZE;
    if (this.collide()) {
      this.position.x -= x * this.SIZE;
      success = false;
    }

    this.position.y += y * this.SIZE;
    return success;
    //if (this.collide()) {
    //  this.position.y -= y * this.SIZE;
    //}
  }

  moveDown(callback) {
    let colliding = false;

    var endMove = false;

    this.resetTimer();
    this.move(0, 1);
    //if the piece collides with something, move it 
    if (this.collide()) {
      endMove = true;
      this.move(0, -1);
      this.putInGrid();
      this.resetToTop();

      const index = Math.random() * this.PIECE_POOL.length | 0;
      this.piece = new Piece(this.PIECE_POOL.charAt(index));
      
      //this is game over
      if (this.collide()) {
        colliding = true;
        this.grid = new Grid(this.canvas.width / this.SIZE, this.canvas.height / this.SIZE);
      }
    }
    this.grid.sweep(callback, colliding);
    return endMove;
  }

  putInGrid() {
    this.piece.representation.forEach((arr, y) => {
      arr.forEach((val, x) => {
        if (val !== 0) {
          this.grid.setPosition(x + this.posInGridPositions.x, y + this.posInGridPositions.y, val);
        }
      });
    });
  }

  rotateGrid(grid, dir = -1) {
    grid.forEach((arr, y) => {
      for (let x = 0; x < y; x++) {
        [grid[x][y], grid[y][x]] = [grid[y][x], grid[x][y]];
      }
    });
    
    if (dir === -1) {
      grid.forEach(arr => arr.reverse());
    } else if (dir === 1) {
      grid.reverse();
    }
  }

  rotate(dir = -1) {
    const position = this.position.x;
    let offset = 1;

    this.rotateGrid(this.piece.representation, dir);
    
    while (this.collide()) {
      this.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.piece.representation[0].length) {
        this.rotateGrid(this.piece.representation, -dir);
        this.position.x = position;
        return;
      }
    }
  }

  collide() {
    let collision = false;
    this.piece.representation.forEach((arr, y) => {
      arr.forEach((val, x) => {
        if (val !== 0 &&
            (this.grid.grid[y + this.posInGridPositions.y] &&
             this.grid.getPosition(x + this.posInGridPositions.x, y + this.posInGridPositions.y)) !== 0) {
          collision = true;
        }
      });
    });
    return collision;
  }

  resetToTop() {
    this.position = new Vec2(this.canvas.width / 2 - this.SIZE, 0);
  }

  get posInGridPositions() {
    return new Vec2(this.position.x / this.SIZE, this.position.y / this.SIZE);
  }

  set posInGridPositions(val) {
    this.position.x = val.x * this.SIZE;
    this.position.y = val.y * this.SIZE; 
  }

  draw() {
    this.context.save();

    this.piece.representation.forEach((arr, y) => {
      arr.forEach((val, x) => {
        if (this.COLORS[val] !== null) {
          this.context.fillStyle = this.COLORS[val];
          const rectX = this.position.x + x*this.SIZE;
          const rectY = this.position.y + y*this.SIZE;
          this.context.fillRect(rectX, rectY, this.SIZE, this.SIZE);
        } 
      });
    });

    this.grid.grid.forEach((arr, y) => {
      arr.forEach((val, x) => {
        if (this.COLORS[val] !== null) {
          this.context.fillStyle = this.COLORS[val];
          const rectX = x*this.SIZE;
          const rectY = y*this.SIZE;
          this.context.fillRect(rectX, rectY, this.SIZE, this.SIZE);
        } 
      });
    });

    this.context.restore();
  }
}