// Initialization
const canvas = initCanvas();
const context = initContext(canvas);
const [WIDTH, HEIGHT] = dimensions(canvas);
const CELL_WIDTH = 20;

function initCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.height = canvas.scrollHeight;
  canvas.width = canvas.scrollWidth;
  return canvas;
}

function dimensions(canvas) {
  const { width, height } = canvas;
  return [width, height];
}

function initContext(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.moveTo(0, 0);
  return ctx;
}

// utils
function equalPos(cell, cell2) {
  return cell.x === cell2.x && cell.y === cell2.y;
}

function contained(cell, cells) {
  for (const cell2 of cells) {
    if (equalPos(cell, cell2)) {
      return true;
    }
  }
  return false;
}

function div(a, b) {
  return Math.floor(a / b);
}

function borderCollision(x, y) {
  return (
    x < 0 || x > div(WIDTH, CELL_WIDTH) || y < 0 || y > div(HEIGHT, CELL_WIDTH)
  );
}

// Game
class Renderer {
  static get instance() {
    if (!this._instance) {
      this._instance = rendererFactory();
    }
    return this._instance;
  }

  constructor(context) {
    this.context = context;
  }

  drawRect(x, y) {
    this.withPath(x, y, (path) => this.context.stroke(path));
  }

  fillRect(x, y, color) {
    if (color) {
      this.context.fillStyle = color;
    }
    this.withPath(x, y, (path) => this.context.fill(path));
  }

  withPath(x, y, drawHandler) {
    const path = new Path2D();
    const box = this.calcBox(x, y);
    path.moveTo(box[0].x, box[0].y);
    for (const corner of box) {
      path.lineTo(corner.x, corner.y);
    }
    path.closePath();
    drawHandler(path);
  }

  calcBox(x, y) {
    return [
      { x: x * CELL_WIDTH, y: y * CELL_WIDTH },
      { x: x * CELL_WIDTH + CELL_WIDTH, y: y * CELL_WIDTH },
      { x: x * CELL_WIDTH + CELL_WIDTH, y: y * CELL_WIDTH + CELL_WIDTH },
      { x: x * CELL_WIDTH, y: y * CELL_WIDTH + CELL_WIDTH },
    ];
  }
}

function rendererFactory() {
  return new Renderer(context);
}

class RendererAware {
  constructor() {
    this.renderer = Renderer.instance;
  }
}

class Grid extends RendererAware {
  constructor(rows, cols) {
    super();
    this.rows = rows;
    this.cols = cols;
    this.renderer = Renderer.instance;
  }

  draw() {
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        this.drawCell(x, y);
      }
    }
  }

  drawCell(x, y) {
    this.renderer.drawRect(x, y);
  }
}

class DirectionQueue {
  constructor() {
    this.directions = [];
    this.flushedDirection = 'right';
  }

  get nextDirection() {
    if (this.directions.length > 0) {
      const direction = this.directions.shift();
      this.flushedDirection = direction;
    }
    return this.flushedDirection;
  }

  get lastDirection() {
    if (this.directions.length > 0) {
      return this.directions[this.directions.length - 1];
    }
    return this.flushedDirection;
  }

  right() {
    if (this.lastDirection !== 'left') {
      this.directions.push('right');
    }
  }

  left() {
    if (this.lastDirection !== 'right') {
      this.directions.push('left');
    }
  }

  up() {
    if (this.lastDirection !== 'down') {
      this.directions.push('up');
    }
  }

  down() {
    if (this.lastDirection !== 'up') {
      this.directions.push('down');
    }
  }
}

class Cell extends RendererAware {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.color = 'green';
  }

  draw() {
    this.renderer.fillRect(this.x, this.y, this.color);
  }

  clear() {
    this.renderer.fillRect(this.x, this.y, 'white');
    this.renderer.drawRect(this.x, this.y);
  }
}

class Head extends Cell {
  constructor(x, y) {
    super(x, y);
    this.color = 'orange';
  }

  toCell() {
    return new Cell(this.x, this.y);
  }

  turnRight() {
    this.x += 1;
  }

  turnLeft() {
    this.x -= 1;
  }

  turnUp() {
    this.y -= 1;
  }

  turnDown() {
    this.y += 1;
  }
}

class Snake extends RendererAware {
  constructor(directionQueue) {
    super();
    this.directionQueue = directionQueue;
    this.head = new Head(4, 0);
    this.body = [new Cell(3, 0), new Cell(2, 0), new Cell(1, 0)];
  }

  draw() {
    for (const part of this.body) {
      part.draw();
    }
    this.head.draw();
  }

  eat(food) {
    this.body.unshift(food.toCell());
  }

  move() {
    const cell = this.body.pop();
    cell.clear();
    this.body.unshift(this.head.toCell());
    switch (this.directionQueue.nextDirection) {
      case 'right':
        this.head.turnRight();
        break;
      case 'left':
        this.head.turnLeft();
        break;
      case 'up':
        this.head.turnUp();
        break;
      case 'down':
        this.head.turnDown();
        break;
    }
  }
}

class Food extends Cell {
  constructor(x, y) {
    super(x, y);
    this.color = 'red';
  }

  toCell() {
    return new Cell(this.x, this.y);
  }
}

function foodFactory(grid) {
  return new Food(
    Math.floor(Math.random() * grid.rows),
    Math.floor(Math.random() * grid.cols)
  );
}

class Game {
  constructor() {
    this.grid = new Grid(WIDTH / CELL_WIDTH, HEIGHT / CELL_WIDTH);
    this.directionQueue = new DirectionQueue();
    bindInputs(this.directionQueue);
    this.snake = new Snake(this.directionQueue);
    this.food = null;
    this.running = true;
  }

  spawnFood() {
    let food = null;
    while (
      food == null ||
      contained(food, this.snake.body) ||
      equalPos(this.snake.head, food)
    ) {
      console.log('endless');
      food = foodFactory(this.grid);
    }
    food.draw();
    this.food = food;
  }

  canSnakeEat() {
    return equalPos(this.snake.head, this.food);
  }

  checkGameOver() {
    if (
      contained(this.snake.head, this.snake.body) ||
      borderCollision(this.snake.head.x, this.snake.head.y)
    ) {
      this.running = false;
      clearInterval(this.interval);
    }
  }

  main() {
    this.grid.draw();
    this.spawnFood();
    this.interval = setInterval(() => {
      this.snake.move();
      this.checkGameOver();
      if (!this.running) {
        return;
      }
      if (this.canSnakeEat()) {
        this.snake.eat(this.food);
        this.spawnFood();
      }

      this.snake.draw();
    }, 200);
  }
}

function bindInputs(directionQueue) {
  window.onkeydown = (e) => {
    switch (e.code) {
      case 'KeyW':
        e.preventDefault();
        directionQueue.up();
        break;
      case 'KeyD':
        e.preventDefault();
        directionQueue.right();
        break;
      case 'KeyS':
        e.preventDefault();
        directionQueue.down();
        break;
      case 'KeyA':
        e.preventDefault();
        directionQueue.left();
        break;
      default:
        break;
    }
  };
}

const game = new Game();
game.main();
