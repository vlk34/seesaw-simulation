export function detectCollision(seesaw, balls) {
  const fulcrumHeight = 40;
  const fulcrumY = seesaw.y - fulcrumHeight / 2;

  for (let ball of balls) {
    // check if ball is within the seesaw's horizontal bounds
    if (
      ball.x >= seesaw.x - seesaw.width / 2 &&
      ball.x <= seesaw.x + seesaw.width / 2
    ) {
      // calculate the rotated plank surface Y position at this X
      const distanceFromCenter = ball.x - seesaw.x;
      const rotatedPlankY =
        fulcrumY +
        distanceFromCenter * Math.sin(seesaw.rotation || 0) -
        seesaw.height / 2;

      // check if ball hits the rotated plank surface
      if (ball.y + ball.radius >= rotatedPlankY && !ball.isStopped) {
        ball.y = rotatedPlankY - ball.radius;
        ball.vy = 0;
        ball.isStopped = true;
        ball.fixedDistanceFromCenter = ball.x - seesaw.x;
      }
    }
  }
}

export function updateBallPositions(seesaw, balls) {
  const fulcrumHeight = 40;
  const fulcrumY = seesaw.y - fulcrumHeight / 2;

  for (let ball of balls) {
    if (ball.isStopped && ball.fixedDistanceFromCenter !== undefined) {
      // to make sure ball stays at the same distance from center when rotating
      ball.x = seesaw.x + ball.fixedDistanceFromCenter;

      // update Y position to follow the rotated seesaw surface
      const rotatedPlankY =
        fulcrumY +
        ball.fixedDistanceFromCenter * Math.sin(seesaw.rotation || 0) -
        seesaw.height / 2;
      ball.y = rotatedPlankY - ball.radius;
    }
  }
}

export function calculateTorque(seesaw, balls) {
  let totalTorque = 0;

  for (let ball of balls) {
    if (ball.isStopped) {
      const distanceFromFulcrum = ball.x - seesaw.x;
      const torque = ball.weight * distanceFromFulcrum;
      totalTorque += torque;
    }
  }

  return totalTorque;
}

export function updateSeesawRotation(seesaw, totalTorque, deltaTime = 1) {
  if (seesaw.rotation === undefined) seesaw.rotation = 0;
  if (seesaw.angularVelocity === undefined) seesaw.angularVelocity = 0;

  // constants , maybe remove later if it makes it too complicated to animate the rotation
  const momentOfInertia = 1000;
  const damping = 0.98;
  const maxRotation = Math.PI / 6;

  // calculate angular acceleration from torque
  const angularAcceleration = totalTorque / momentOfInertia;

  // update angular velocity and apply damping
  seesaw.angularVelocity += angularAcceleration * deltaTime;
  seesaw.angularVelocity *= damping;

  // update rotation
  seesaw.rotation += seesaw.angularVelocity * deltaTime;

  // clamp rotation to prevent extreme tilting
  seesaw.rotation = Math.max(
    -maxRotation,
    Math.min(maxRotation, seesaw.rotation)
  );

  return seesaw.rotation;
}
