function setupCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'game-window';
  canvas.classList.add('game-window');
  canvas.width = 334;
  canvas.height = 800;
  document.body.appendChild(canvas);
  return canvas;
}
export default setupCanvas;
