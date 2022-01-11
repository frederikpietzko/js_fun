import { Gravity } from './gravity';
import { Grid } from './grid';
import { InputHandler } from './input';
import { IShape } from './shapes';
import './style.css';

const grid = new Grid({
  rows: 10,
  cols: 24,
});

grid.draw();
const iShape = new IShape(grid);
iShape.draw();
const inputHandler = new InputHandler();
inputHandler.currentShape = iShape;
window.addEventListener('keydown', (e) => {
  e.preventDefault();
  console.log(e);
  if (e.code === 'Space') {
    inputHandler.handleSpace();
  }
});
const gravity = new Gravity(grid);
setInterval(() => {
  gravity.apply(iShape);
  iShape.draw();
}, 1000);
