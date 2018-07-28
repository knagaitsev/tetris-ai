class Piece {
  constructor(label) {
    if (label === 'O') {
      this.representation = [[1, 1],
                             [1, 1]];
    } else if (label === 'I') {
      this.representation = [[0, 2, 0, 0],
                             [0, 2, 0, 0],
                             [0, 2, 0, 0],
                             [0, 2, 0, 0]];
    } else if (label === 'S') {
      this.representation = [[0, 0, 0],
                             [0, 3, 3],
                             [3, 3, 0]];
    } else if (label === 'Z') {
      this.representation = [[0, 0, 0],
                             [4, 4, 0],
                             [0, 4, 4]];
    } else if (label === 'L') {
      this.representation = [[0, 5, 0],
                             [0, 5, 0],
                             [0, 5, 5]];
    } else if (label === 'J') {
      this.representation = [[0, 6, 0],
                             [0, 6, 0],
                             [6, 6, 0]];
    } else if (label === 'T') {
      this.representation = [[0, 0, 0],
                             [7, 7, 7],
                             [0, 7, 0]];
    }
  }
}