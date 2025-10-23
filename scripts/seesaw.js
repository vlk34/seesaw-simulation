export function drawSeesaw(x, y, width, height, ctx, rotation = 0) {
  // save the current context state
  ctx.save();

  // draw the triangular fulcrum
  const fulcrumHeight = 40;
  const fulcrumWidth = 60;

  ctx.beginPath();
  ctx.moveTo(x, y - fulcrumHeight / 2); // top point
  ctx.lineTo(x - fulcrumWidth / 2, y + fulcrumHeight / 2); // bottom left
  ctx.lineTo(x + fulcrumWidth / 2, y + fulcrumHeight / 2); // bottom right
  ctx.closePath();
  ctx.fillStyle = "#8B4513";
  ctx.fill();
  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 2;
  ctx.stroke();

  // move to the pivot point and rotate for the plank
  ctx.translate(x, y - fulcrumHeight / 2);
  ctx.rotate(rotation);

  // draw the seesaw plank (now rotated)
  const plankY = -height / 2;

  // gradient for plank
  const gradient = ctx.createLinearGradient(
    0,
    plankY - height / 2,
    0,
    plankY + height / 2
  );
  gradient.addColorStop(0, "#D2691E");
  gradient.addColorStop(0.5, "#CD853F");
  gradient.addColorStop(1, "#A0522D");

  ctx.beginPath();
  ctx.roundRect(-width / 2, plankY - height / 2, width, height, 5);
  ctx.fillStyle = gradient;
  ctx.fill();

  // add border to the plank
  ctx.strokeStyle = "#8B4513";
  ctx.lineWidth = 3;
  ctx.stroke();

  // wood grain effect
  ctx.strokeStyle = "#A0522D";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const lineY = plankY + (i - 1) * 6;
    ctx.beginPath();
    ctx.moveTo(-width / 2 + 10, lineY);
    ctx.lineTo(width / 2 - 10, lineY);
    ctx.stroke();
  }

  // restore the context state
  ctx.restore();

  // pivot point (drawn after restore so it's not rotated)
  ctx.beginPath();
  ctx.arc(x, y - fulcrumHeight / 2, 3, 0, 2 * Math.PI);
  ctx.fillStyle = "#2F4F4F";
  ctx.fill();
}
