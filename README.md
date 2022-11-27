Video: https://youtu.be/pXTfgw9A08w

Interactive Demo: https://knagaitsev.github.io/tetris-ai/public/

### Tetris AI

This is a Tetris AI written in JavaScript. It was optimized using a genetic algorithm, but can often only achieve 1000-2000 lines per game. It is still in development, so hopefully we will soon reach the perfect Tetris AI!

This project is unique in that I will not give the AI knowledge of the next piece. It has already been proven that next piece knowledge is highly advantageous. I have not implemented T-Spins or other complex Tetris moves, but I will probably do so eventually.

The AI uses the following parameters to determine how good a move is:
- Hole count
- Bumpiness
- Lines Cleared

Among some other minor parameters.

![alt text](https://firebasestorage.googleapis.com/v0/b/loon-ride-webpage.appspot.com/o/media%2F-LIryL32xXc39kT0QhDG?alt=media&token=a872dcc6-0042-4c26-9081-c7ce8cac633f "Genetic Algorithm Tetris AI")

### Screenshots:

![alt text](https://firebasestorage.googleapis.com/v0/b/loon-ride-webpage.appspot.com/o/media%2F-LIs9B_hL1zfE04UaH2B?alt=media&token=b443554b-8fe6-4ad4-a8ed-0c755fb4c38b "Tetris AI Demo")

### Contributing

Any contributions are welcome. Please join my Discord to learn more: https://discord.gg/Sfbg2Sh

### Development & Training

Before developing, you will need Node.js and npm installed.

To develop this project, clone this repository, then go into the *training* directory and type:

```bash
npm install
```

From there, you can do
```bash
npm train
```
to run the genetic algorithm. Data is outputted in the *data* folder.

### Running Demo Locally

If you want to run the demo, install the global module live-server like this:
```bash
npm install -g live-server
```

Then go into the *public* directory and do:
```bash
live-server
```

### Sources that I built off of

tetris-js: https://github.com/simon-tiger/tetris-js

genetic-js: https://github.com/subprotocol/genetic-js
