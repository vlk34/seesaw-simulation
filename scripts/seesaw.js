export function drawSeesaw(x, y, width, height, ctx) {
  ctx.beginPath();
  ctx.rect(x - width / 2, y - height / 2, width, height);
  ctx.fillStyle = "brown";
  ctx.fill();
}
