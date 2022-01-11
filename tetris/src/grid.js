import { RendererAware } from './renderer';

export class Grid extends RendererAware {
  constructor(config) {
    super();
    this.rows = config.rows;
    this.cols = config.cols;
  }

  draw() {
    for (let x = 0; x < this.rows; x++) {
      for (let y = 0; y < this.cols; y++) {
        this.renderer.drawRect(x, y);
      }
    }
  }
}
