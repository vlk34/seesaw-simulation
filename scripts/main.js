import {
  detectCollision,
  calculateTorque,
  calculateWeights,
  updateSeesawRotation,
  updateBallPositions,
  getRotatedSeesawBounds,
  getConsistentSpawnBounds,
} from "./physics.js";
import { drawSeesaw } from "./seesaw.js";
import { clearBalls } from "./utils.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
document.getElementById("clear-btn").addEventListener("click", clearBalls);

const gravity = 0.05;
export const balls = [];

const seesaw = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 80,
  width: 420,
  height: 18,
};

function getBallStyle() {
  const styles = [
    { color: "#8B4513", border: "#654321" },
    { color: "#CD853F", border: "#8B4513" },
    { color: "#A0522D", border: "#654321" },
    { color: "#D2691E", border: "#A0522D" },
    { color: "#B8860B", border: "#8B6914" },
    { color: "#2F4F4F", border: "#1C3030" },
  ];
  return styles[Math.floor(Math.random() * styles.length)];
}

function generateBallProperties() {
  const weight = Math.floor(Math.random() * 10) + 1;
  const radius = Math.sqrt(weight) * 10; // size is proportional to the sqrt of weight
  return {
    weight: weight,
    radius: Math.max(12, Math.min(radius, 45)),
  };
}

function drawBall(x, y, radius, style, weight) {
  // main ball
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = style.color;
  ctx.fill();

  // border
  ctx.strokeStyle = style.border;
  ctx.lineWidth = 2;
  ctx.stroke();

  // ball highlight
  ctx.beginPath();
  ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.2, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fill();

  // display weight on the ball
  ctx.fillStyle = "white";
  ctx.font = `bold ${Math.max(12, radius * 0.5)}px Arial`;
  ctx.textAlign = "center";
  ctx.fillText(`${weight}kg`, x, y + 4);
}

// clear
// check collision
// apply gravity
// increase velocity so it stacks up
// then add velocity to position
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // physics calculations
  detectCollision(seesaw, balls);
  const torqueData = calculateTorque(seesaw, balls);
  const weightData = calculateWeights(seesaw, balls);
  const rotationData = updateSeesawRotation(seesaw, torqueData);
  updateBallPositions(seesaw, balls);

  // update weight displays
  updateWeightDisplays(weightData.leftWeight, weightData.rightWeight);

  // update tilt angle display
  updateTiltDisplay(rotationData.angleDegrees);

  // draw seesaw with rotation
  drawSeesaw(
    seesaw.x,
    seesaw.y,
    seesaw.width,
    seesaw.height,
    ctx,
    seesaw.rotation
  );

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    if (ball.isStopped) {
      drawBall(ball.x, ball.y, ball.radius, ball.style, ball.weight);
    } else {
      // apply gravity (reduced weight scaling to prevent excessive speed)
      ball.vy += gravity * (1 + ball.weight / 20);

      const maxVelocity = 8;
      ball.vy = Math.min(ball.vy, maxVelocity);

      ball.y += ball.vy;

      if (ball.y - ball.radius > canvas.height) {
        balls.splice(i, 1);
        continue;
      }

      drawBall(ball.x, ball.y, ball.radius, ball.style, ball.weight);
    }
  }

  requestAnimationFrame(animate);
}

animate();

canvas.addEventListener("click", (event) => {
  const { x, y } = getMousePosition(event);

  console.log("Click detected at:", x, y); // debug

  // use consistent spawn bounds that work for any rotation angle
  const fulcrumHeight = 40;
  const bounds = getConsistentSpawnBounds(seesaw);
  const seesawTopY = seesaw.y - fulcrumHeight / 2 - seesaw.height / 2;

  console.log("Consistent spawn bounds:", {
    leftBound: bounds.leftBound,
    rightBound: bounds.rightBound,
    topY: seesawTopY - 50,
    pivotY: bounds.pivotY,
  }); // debug

  // check if click is within the consistent spawn bounds and ONLY above seesaw level
  const isOnPlank =
    x >= bounds.leftBound && x <= bounds.rightBound && y < seesawTopY; // only allow clicking ABOVE the plank, not on or below it

  console.log("Is on plank:", isOnPlank); // debug log

  if (isOnPlank) {
    const ballProps = generateBallProperties();

    console.log("Creating ball:", ballProps); // debug log

    balls.push({
      x,
      y: Math.min(y, seesawTopY - ballProps.radius), // ensure ball starts above the plank
      radius: ballProps.radius,
      weight: ballProps.weight,
      style: getBallStyle(),
      vy: 0,
      isStopped: false,
    });

    // save state to localStorage
    saveGameState();
  }
});

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function updateWeightDisplays(leftWeight, rightWeight) {
  const leftWeightElement = document.getElementById("left-weight");
  const rightWeightElement = document.getElementById("right-weight");

  if (leftWeightElement)
    leftWeightElement.textContent = `Left: ${leftWeight}kg`;
  if (rightWeightElement)
    rightWeightElement.textContent = `Right: ${rightWeight}kg`;
}

function updateTiltDisplay(angleDegrees) {
  const tiltElement = document.getElementById("tilt-angle");

  if (tiltElement) {
    const direction = angleDegrees > 0 ? "→" : angleDegrees < 0 ? "←" : "";
    tiltElement.textContent = `Tilt: ${Math.abs(angleDegrees)}°${direction}`;
  }
}

function saveGameState() {
  const gameState = {
    balls: balls.map((ball) => ({
      x: ball.x,
      y: ball.y,
      radius: ball.radius,
      weight: ball.weight,
      style: ball.style,
      isStopped: ball.isStopped,
      fixedDistanceFromCenter: ball.fixedDistanceFromCenter,
    })),
    seesaw: {
      rotation: seesaw.rotation,
      targetRotation: seesaw.targetRotation,
    },
  };
  localStorage.setItem("seesawGame", JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem("seesawGame");
  if (savedState) {
    try {
      const gameState = JSON.parse(savedState);

      // Restore balls
      balls.length = 0; // Clear current balls
      gameState.balls.forEach((ballData) => {
        balls.push({
          ...ballData,
          vy: 0, // Reset velocity
        });
      });

      // Restore seesaw state
      if (gameState.seesaw) {
        seesaw.rotation = gameState.seesaw.rotation || 0;
        seesaw.targetRotation = gameState.seesaw.targetRotation || 0;
      }
    } catch (error) {
      console.error("Error loading game state:", error);
    }
  }
}

// Load state on page load
loadGameState();
