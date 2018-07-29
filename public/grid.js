class Grid {
  constructor(w, h) {
    this.grid = [];
    while (h--) {
      this.grid.push(new Array(w).fill(0));
    }
  }

  getPosition(x, y) {
    return this.grid[y][x];
  }

  setPosition(x, y, val) {
    this.grid[y][x] = val;
  }

  sweep(callback, boolean) {
    let counter = 0;
    for (let y = this.grid.length-1; y >= 0; y--) {
      const arr = this.grid[y];
      
      let full = true;
      arr.forEach((val, x) => {
        if (val === 0) {
          full = false;
        }
      });

      if (full) {
        const row = this.grid.splice(y, 1)[0].fill(0);
        this.grid.unshift(row);
        counter++;
      }
    }
    callback(counter, boolean);
  }

  getGridHeight() {
    return this.grid.length;
  }

  getCurrentHeight() {
    var maxHeight = 0;
    for (var y = 0 ; y < this.grid.length ; y++) {
      for (var x = 0 ; x < this.grid[y].length ; x++) {
        if (this.grid[y][x] != 0) {
          maxHeight = (this.grid.length - y);
          return maxHeight;
        }
      }
    }
  }

  isRowFull(y) {
    var full = true;
    for (var x = 0 ; x < this.grid[y].length ; x++) {
      if (this.grid[y][x] === 0) {
        full = false;
      }
    }
    return full;
  }

  getHoleCount() {
    var holeCount = 0;
    for (var x = 0 ; x < this.grid[0].length ; x++) {
      var hitBlock = false;
      for (var y = 0 ; y < this.grid.length ; y++) {
        if(this.isRowFull(y)) {
          continue;
        }
        if (this.grid[y][x] != 0) {
          hitBlock = true;
        }
        if (hitBlock && this.grid[y][x] === 0) {
          holeCount++;
        }
      }
    }

    return holeCount;
  }
  getFullCount() {
    var fullCount = 0;
    for (var y = this.grid.length - 1 ; y >= 0 ; y--) {
      var full = true;
      for (var x = 0 ; x < this.grid[y].length ; x++) {
        if (this.grid[y][x] === 0) {
          full = false;
        }
      }
      if (full) {
        fullCount++;
      }
    }

    return fullCount;
  }
  getHeightSum() {
    var heightSum = 0;
    for (var x = 0 ; x < this.grid[0].length ; x++) {
      for (var y = 0 ; y < this.grid.length ; y++) {
        if (this.grid[y][x] != 0) {
          heightSum += (this.grid.length - y);
          break;
        }
      }
    }

    return heightSum;
  }
  getBumpiness() {
    var gridClone = JSON.parse(JSON.stringify(this.grid));
    this.sweep(function(counter, boolean) {}, false);

    var bumpiness = 0;
    var prevHeight = -1;
    for (var x = 0 ; x < this.grid[0].length ; x++) {
      for (var y = 0 ; y < this.grid.length ; y++) {
        if (this.grid[y][x] != 0 || y == this.grid.length - 1) {
          var height = (this.grid.length - y);
          if (prevHeight != -1) {
            bumpiness += Math.abs(height - prevHeight);
          }
          prevHeight = height;
          break;
        }
      }
    }

    this.grid = gridClone;

    return bumpiness;
  }

  getRowsWithHoles() {
    var rows = [];

    for (var x = 0 ; x < this.grid[0].length ; x++) {
      var hitBlock = false;
      for (var y = 0 ; y < this.grid.length ; y++) {
        if(this.isRowFull(y)) {
          continue;
        }
        if (this.grid[y][x] != 0) {
          hitBlock = true;
        }
        if (hitBlock && this.grid[y][x] === 0 && rows.indexOf(y) == -1) {
          rows.push(y);
        }
      }
    }

    return rows.length;
  }
}
