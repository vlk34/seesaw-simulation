export function detectCollision(seesaw, balls) {
  // Calculate the top surface of the plank
  const fulcrumHeight = 40;
  const plankTopY = seesaw.y - fulcrumHeight / 2 - seesaw.height / 2;

  for (let ball of balls) {
    // check for horizontal constraints
    if (
      ball.x >= seesaw.x - seesaw.width / 2 &&
      ball.x <= seesaw.x + seesaw.width / 2
    ) {
      // check for vertical constraints
      if (ball.y + ball.radius >= plankTopY && !ball.isStopped) {
        ball.y = plankTopY - ball.radius; // Position ball on top of plank
        ball.vy = 0;
        ball.isStopped = true;
      }
    }
  }
}

export function calculateTorque(seesaw, balls) {
  let totalTorque = 0;

  for (let ball of balls) {
    if (ball.isStopped) {
      // distance from center of seesaw
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

  // constants
  const momentOfInertia = 1000; // resistance to rotation
  const damping = 0.98; // reduces rotation over time
  const maxRotation = Math.PI / 6; // limit rotation to 30 degrees

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
