const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gravity = 0.05;
const balls = [];

// add kg and size variance later
function randomColor() {
  const colors = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "black",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function drawBall(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

// clear
// apply gravity
// increase velocity so it stacks up
// then add velocity to position
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ball.vy += gravity;
    ball.y += ball.vy;

    if (ball.y - ball.radius > canvas.height) {
      balls.splice(i, 1);
      continue;
    }

    drawBall(ball.x, ball.y, ball.radius, ball.color);
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
    color: randomColor(),
    vy: 0,
  });
});

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}
