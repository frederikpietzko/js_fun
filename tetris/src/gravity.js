import _ from 'lodash';
export class Gravity {
  constructor(grid) {
    this.grid = grid;
  }

  apply(shape) {
    if (!shape.atBottom()) {
      for (const part of shape.parts) {
        part.clear();
        part.y += 1;
      }
    }
  }
}
