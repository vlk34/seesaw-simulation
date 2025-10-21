export function detectCollision(seesaw, balls) {
  // Calculate the top surface of the plank
  const fulcrumHeight = 30;
  const plankTopY = seesaw.y - fulcrumHeight / 2 - seesaw.height / 2;

  for (let ball of balls) {
    // check for horizontal constraints
    if (
      ball.x >= seesaw.x - seesaw.width / 2 &&
      ball.x <= seesaw.x + seesaw.width / 2
    ) {
      // checjk for vertical constraints
      if (ball.y + ball.radius >= plankTopY && !ball.isStopped) {
        ball.y = plankTopY - ball.radius; // Position ball on top of plank
        ball.vy = 0;
        ball.isStopped = true;
      }
    }
  }
}
