import setupCanvas from './setupCanvas';

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.canvas.height = canvas.scrollHeight;
    this.canvas.width = canvas.scrollWidth;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.cellWidth = Math.min(this.width / 10, this.height / 24);
  }

  drawRect(x, y) {
    this.withPath(x, y, (path) => this.context.stroke(path));
  }

  fillRect(x, y, color) {
    if (color) {
      this.context.fillStyle = color;
    }
    this.withPath(x, y, (path) => {
      this.context.fill(path);
      this.context.stroke(path);
    });
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

  clearRect(x, y) {
    this.fillRect(x, y, 'white');
  }

  calcBox(x, y) {
    return [
      { x: x * this.cellWidth, y: y * this.cellWidth },
      { x: x * this.cellWidth + this.cellWidth, y: y * this.cellWidth },
      {
        x: x * this.cellWidth + this.cellWidth,
        y: y * this.cellWidth + this.cellWidth,
      },
      { x: x * this.cellWidth, y: y * this.cellWidth + this.cellWidth },
    ];
  }
}

const renderer = new Renderer(setupCanvas());
export class RendererAware {
  constructor() {
    this.renderer = renderer;
  }
}
