export function getRotatedSeesawBounds(seesaw) {
  const fulcrumHeight = 40;
  const rotation = seesaw.rotation || 0;

  // calculate the actual horizontal extent of the rotated plank
  const halfWidth = seesaw.width / 2;
  const halfHeight = seesaw.height / 2;

  // when rotated, the horizontal extent changes
  const rotatedHorizontalExtent =
    Math.abs(halfWidth * Math.cos(rotation)) +
    Math.abs(halfHeight * Math.sin(rotation));

  // make the droppable area slightly smaller (95% of actual size)
  const safetyMargin = 0.95;
  const safeExtent = rotatedHorizontalExtent * safetyMargin;

  return {
    leftBound: seesaw.x - safeExtent,
    rightBound: seesaw.x + safeExtent,
    pivotY: seesaw.y - fulcrumHeight / 2,
  };
}

export function getConsistentSpawnBounds(seesaw) {
  const halfWidth = seesaw.width / 2;
  const halfHeight = seesaw.height / 2;

  // calculate the minimum horizontal extent at maximum rotation (30 degrees)
  const maxRotation = Math.PI / 6; // 30 degrees in radians
  const minHorizontalExtent =
    Math.abs(halfWidth * Math.cos(maxRotation)) +
    Math.abs(halfHeight * Math.sin(maxRotation));

  // apply safety margins:
  const safetyMargin = 0.92;
  const safeExtent = minHorizontalExtent * safetyMargin;

  return {
    leftBound: seesaw.x - safeExtent,
    rightBound: seesaw.x + safeExtent,
    pivotY: seesaw.y - 40 / 2,
  };
}

export function detectCollision(seesaw, balls) {
  const fulcrumHeight = 40;
  const fulcrumY = seesaw.y - fulcrumHeight / 2;
  const bounds = getRotatedSeesawBounds(seesaw);

  for (let ball of balls) {
    if (ball.isStopped) continue;

    // check if ball is within the rotated seesaw's horizontal bounds
    if (ball.x >= bounds.leftBound && ball.x <= bounds.rightBound) {
      // calculate the rotated plank surface Y position at this X
      const distanceFromCenter = ball.x - seesaw.x;
      const rotatedPlankY =
        fulcrumY +
        distanceFromCenter * Math.sin(seesaw.rotation || 0) -
        seesaw.height / 2;

      const currentBottom = ball.y + ball.radius;
      const nextBottom = ball.y + ball.vy + ball.radius;

      // check if ball is at or below the plank surface, or will cross it in the next frame
      if (
        currentBottom >= rotatedPlankY ||
        (ball.y + ball.radius < rotatedPlankY && nextBottom >= rotatedPlankY)
      ) {
        // position ball exactly on top of the plank surface
        ball.y = rotatedPlankY - ball.radius;
        ball.vy = 0;
        ball.isStopped = true;
        ball.fixedDistanceFromCenter = ball.x - seesaw.x;

        // log the ball landing
        logBallLanding(ball, seesaw);
      }
    }
  }
}

function logBallLanding(ball, seesaw) {
  const distance = Math.abs(ball.fixedDistanceFromCenter);
  const side = ball.fixedDistanceFromCenter > 0 ? "right" : "left";
  const message = `${ball.weight}kg dropped on ${side} side ${Math.round(
    distance
  )}px from center`;

  addLogMessage(message);
}

function addLogMessage(message) {
  const logContainer = document.getElementById("log-container");
  const logEntry = document.createElement("div");
  logEntry.className = "log-entry";
  logEntry.textContent = message;

  // add timestamp
  const timestamp = new Date().toLocaleTimeString();
  logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;

  logContainer.appendChild(logEntry);

  // auto-scroll to bottom
  logContainer.scrollTop = logContainer.scrollHeight;

  // limit log entries to prevent memory issues
  if (logContainer.children.length > 50) {
    logContainer.removeChild(logContainer.firstChild);
  }
}

export function updateBallPositions(seesaw, balls) {
  const fulcrumHeight = 40; // Match the value from seesaw.js
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
  let leftTorque = 0;
  let rightTorque = 0;

  for (let ball of balls) {
    if (ball.isStopped) {
      const distanceFromFulcrum = Math.abs(ball.x - seesaw.x);
      const torque = ball.weight * distanceFromFulcrum;

      if (ball.x < seesaw.x) {
        leftTorque += torque;
      } else {
        rightTorque += torque;
      }
    }
  }

  return { leftTorque, rightTorque, totalTorque: rightTorque - leftTorque };
}

export function updateSeesawRotation(seesaw, torqueData) {
  if (seesaw.rotation === undefined) seesaw.rotation = 0;
  if (seesaw.targetRotation === undefined) seesaw.targetRotation = 0;

  // calculate target angle using the specified formula
  const targetAngleDegrees = Math.max(
    -30,
    Math.min(30, (torqueData.rightTorque - torqueData.leftTorque) / 10)
  );
  seesaw.targetRotation = (targetAngleDegrees * Math.PI) / 180; // convert to radians

  // smooth transition to target rotation
  const rotationSpeed = 0.1; // Adjust for smoother/faster animation
  const rotationDiff = seesaw.targetRotation - seesaw.rotation;
  seesaw.rotation += rotationDiff * rotationSpeed;

  // convert current rotation back to degrees for display
  const currentAngleDegrees = Math.round((seesaw.rotation * 180) / Math.PI);

  return {
    rotation: seesaw.rotation,
    leftTorque: torqueData.leftTorque,
    rightTorque: torqueData.rightTorque,
    angleDegrees: currentAngleDegrees,
  };
}
