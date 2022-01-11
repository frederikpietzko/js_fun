import { times } from 'lodash';
import { RendererAware } from './renderer';

const colors = ['red'];

class Part extends RendererAware {
  constructor(x, y, color) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw() {
    this.renderer.fillRect(this.x, this.y, this.color);
  }

  clear() {
    this.renderer.clearRect(this.x, this.y);
  }
}

class BaseShape {
  constructor(grid) {
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.rotation = 0;
    this.parts = [];
    this.grid = grid;
  }

  draw() {
    for (const part of this.parts) {
      part.draw();
    }
  }

  clear() {
    for (const part of this.parts) {
      part.clear();
    }
  }

  redraw() {
    this.clear();
    this.draw();
  }

  atBottom() {
    const minY = _.max(this.parts.map((part) => part.y));
    return minY >= this.grid.cols - 1;
  }

  rotate() {
    throw new Error('Not Implemented');
  }
}

export class IShape extends BaseShape {
  constructor(grid) {
    super(grid);
    this.rotation = 0;
    this.parts = [
      new Part(3, 0, this.color),
      new Part(3, 1, this.color),
      new Part(3, 2, this.color),
      new Part(3, 3, this.color),
      new Part(3, 4, this.color),
    ];
  }

  adjustRotation() {
    this.rotation += 90;
    if (this.rotation === 360) {
      this.rotation = 0;
    }
  }

  rotate() {
    this.adjustRotation();
    this.clear();
    if (this.rotation === 90) {
      this.parts[0].x += 2;
      this.parts[0].y += 2;
      this.parts[1].x += 1;
      this.parts[1].y += 1;
      this.parts[3].x += -1;
      this.parts[3].y += -1;
      this.parts[4].x += -2;
      this.parts[4].y += -2;
    }
    this.draw();
  }
}
