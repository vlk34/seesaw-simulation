import { detectCollision } from "./physics.js";
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
  width: 400,
  height: 15,
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

function drawBall(x, y, radius, style) {
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
}

// clear
// check collision
// apply gravity
// increase velocity so it stacks up
// then add velocity to position
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSeesaw(seesaw.x, seesaw.y, seesaw.width, seesaw.height, ctx);
  detectCollision(seesaw, balls);
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    if (ball.isStopped) {
      drawBall(ball.x, ball.y, ball.radius, ball.style);
    } else {
      ball.vy += gravity;
      ball.y += ball.vy;

      if (ball.y - ball.radius > canvas.height) {
        balls.splice(i, 1);
        continue;
      }

      drawBall(ball.x, ball.y, ball.radius, ball.style);
    }
  }

  requestAnimationFrame(animate);
}

animate();

canvas.addEventListener("click", (event) => {
  const { x, y } = getMousePosition(event);
  balls.push({
    x,
    y,
    radius: 20,
    style: getBallStyle(),
    vy: 0,
    isStopped: false,
  });
});

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
