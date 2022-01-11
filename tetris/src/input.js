export class InputHandler {
  constructor() {
    this.currentShape = null;
  }

  handleSpace() {
    if (this.currentShape) {
      this.currentShape.rotate();
    }
  }

  handleDown() {}
}
