export function detectCollision(seesaw, balls) {
  // get seesaw y + height / 2 position
  // check all balls y + radius
  // if they touch, stop the velocity of the ball
  // if not nothing
  for (let i = balls.length - 1; i >= 0; i--) {
    const ball = balls[i];
    console.log(ball.y);
    console.log(seesaw.x - seesaw.width / 2);
    if (
      ball.y + ball.radius >= seesaw.y - seesaw.height / 2 &&
      ball.x >= seesaw.x - seesaw.width / 2 &&
      ball.x <= seesaw.x + seesaw.width / 2 &&
      ball.y + ball.radius <= seesaw.y + seesaw.height / 2
    ) {
      balls[i].vy = 0;
      balls[i].color = "black";
      balls[i].isStopped = true;
    }
  }
}
