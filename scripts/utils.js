import { balls } from "./main.js";

export function clearBalls() {
  balls.length = 0;

  // clear localStorage and reset seesaw
  localStorage.removeItem("seesawGame");

  // clear log
  const logContainer = document.getElementById("log-container");
  if (logContainer) {
    logContainer.innerHTML = "";
  }

  // reset weight displays
  const leftWeightElement = document.getElementById("left-weight");
  const rightWeightElement = document.getElementById("right-weight");
  const tiltElement = document.getElementById("tilt-angle");

  if (leftWeightElement) leftWeightElement.textContent = "Left: 0";
  if (rightWeightElement) rightWeightElement.textContent = "Right: 0";
  if (tiltElement) tiltElement.textContent = "Tilt: 0°";
}
