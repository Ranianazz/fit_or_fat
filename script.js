// Canvas elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let player = {
  x: 175,
  y: 530,
  width: 50,
  height: 60,
  speed: 5,
  size: 60,
};

let foods = [];
let score = 0;
let burgerHitCount = 0;
let gameActive = true;

// Controls
let keys = { left: false, right: false };

// Load images
const playerImg = new Image();
playerImg.src = "boy1.png";

const saladImg = new Image();
saladImg.src = "salad1.png";

const burgerImg = new Image();
burgerImg.src = "hamburger.png";

// Food spawn interval variable
let spawnInterval = null;

// ========== GAME OVER OVERLAY FUNCTIONS ==========
function showGameOverlay() {
  // Remove existing overlay if any
  const existingOverlay = document.getElementById("dynamicOverlay");
  if (existingOverlay) existingOverlay.remove();

  // Create overlay element
  const overlay = document.createElement("div");
  overlay.id = "dynamicOverlay";
  overlay.className = "game-overlay";

  // Banner
  const banner = document.createElement("div");
  banner.className = "game-over-banner";
  banner.innerText = "💀 GAME OVER 💀";

  // Burger count message
  const burgerCountMsg = document.createElement("div");
  burgerCountMsg.innerText = `🍔 Burgers caught: ${burgerHitCount} / 5 🍔`;
  burgerCountMsg.style.color = "#ffdab9";
  burgerCountMsg.style.fontSize = "1.4rem";
  burgerCountMsg.style.fontWeight = "bold";
  burgerCountMsg.style.backgroundColor = "#00000088";
  burgerCountMsg.style.padding = "6px 16px";
  burgerCountMsg.style.borderRadius = "32px";

  // Play again button
  const playBtn = document.createElement("button");
  playBtn.innerText = "🔄 PLAY AGAIN 🔄";
  playBtn.className = "play-again-btn";

  playBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resetGame();
  });

  overlay.appendChild(banner);
  overlay.appendChild(burgerCountMsg);
  overlay.appendChild(playBtn);

  // Attach to game container
  const gameContainer = document.querySelector(".game-container");
  gameContainer.appendChild(overlay);
}

function triggerGameOver() {
  if (!gameActive) return;
  gameActive = false;
  document.getElementById("status").innerHTML =
    "💀 GAME OVER! You ate 5 burgers! Click PLAY AGAIN 💀";
  showGameOverlay();
}

// ========== RESET GAME ==========
function resetGame() {
  // Remove overlay
  const overlay = document.getElementById("dynamicOverlay");
  if (overlay) overlay.remove();

  // Reset player to original state
  player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 65,
    width: 50,
    height: 60,
    speed: 5,
    size: 60,
  };

  // Ensure player stays within bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size;
  if (player.y + player.size > canvas.height)
    player.y = canvas.height - player.size;
  if (player.y < 0) player.y = 0;

  // Reset game variables
  foods = [];
  score = 0;
  burgerHitCount = 0;
  gameActive = true;

  // Reset status message
  document.getElementById("status").innerHTML =
    "✨ Game restarted! Avoid 5 burgers! ✨";

  // Reset controls
  keys.left = false;
  keys.right = false;
}

// ========== SPAWN FOOD ==========
function spawnFood() {
  if (!gameActive) return;

  const isHealthy = Math.random() > 0.5;

  foods.push({
    x: Math.random() * (canvas.width - 50),
    y: -40,
    size: 50,
    speed: 2.2 + Math.random() * 2.5,
    healthy: isHealthy,
  });
}

// ========== DRAW FUNCTIONS ==========
function drawPlayer() {
  let drawX = player.x;
  let drawY = player.y;

  // Clamp drawing position to keep full image within canvas
  if (drawX < 0) drawX = 0;
  if (drawX + player.size > canvas.width) drawX = canvas.width - player.size;
  if (drawY < 0) drawY = 0;
  if (drawY + player.size > canvas.height) drawY = canvas.height - player.size;

  ctx.drawImage(playerImg, drawX, drawY, player.size, player.size);

  // Draw subtle outline
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#FFB347";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(drawX, drawY, player.size, player.size);
  ctx.restore();
}

function drawFoods() {
  foods.forEach((food) => {
    if (food.healthy) {
      ctx.drawImage(saladImg, food.x, food.y, food.size, food.size);
    } else {
      ctx.drawImage(burgerImg, food.x, food.y, food.size, food.size);
    }
  });
}

function drawUI() {
  // Score
  ctx.fillStyle = "#272343";
  ctx.font = "bold 24px 'Segoe UI'";
  ctx.fillText("🍎 " + score, 18, 48);

  // Burger counter
  ctx.fillStyle = "#f4a261";
  ctx.font = "bold 18px monospace";
  ctx.fillText("🍔 " + burgerHitCount + "/5", canvas.width - 100, 45);

  // Speed and size info
  ctx.font = "12px 'Segoe UI'";
  ctx.fillStyle = "#2b3b36";
  ctx.fillText("speed: " + player.speed.toFixed(1), 12, 85);
  ctx.fillText("size: " + Math.floor(player.size), 12, 105);
}

// ========== UPDATE LOGIC ==========
function updateFoods() {
  if (!gameActive) return;

  for (let i = foods.length - 1; i >= 0; i--) {
    const food = foods[i];
    food.y += food.speed;

    // Collision detection
    if (
      food.x < player.x + player.size &&
      food.x + food.size > player.x &&
      food.y < player.y + player.size &&
      food.y + food.size > player.y
    ) {
      if (food.healthy) {
        // Healthy food: increase speed, decrease size
        player.speed += 0.35;
        if (player.speed > 12) player.speed = 12;
        player.size = Math.max(38, player.size - 1.5);
        score += 10;
        document.getElementById("status").innerHTML =
          "🥗 HEALTHY! +10 🥗 | Speed↑ Size↓";
      } else {
        // Junk food (burger)
        player.speed = Math.max(2.2, player.speed - 0.7);
        player.size = Math.min(90, player.size + 2.5);
        score -= 5;
        burgerHitCount++;

        document.getElementById("status").innerHTML =
          `🍔 JUNK! -5 pts | Burgers: ${burgerHitCount}/5 🍔 | Slower & Bigger!`;

        // Game over trigger at 5 burgers
        if (burgerHitCount >= 5) {
          triggerGameOver();
          return;
        }
      }
      foods.splice(i, 1);
      continue;
    }

    // Remove food if off screen
    if (food.y > canvas.height + 100) {
      foods.splice(i, 1);
    }
  }

  // Keep player fully within canvas bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size;

  // Keep player at bottom but ensure full visibility
  let desiredY = canvas.height - player.size - 5;
  if (desiredY < 0) desiredY = 0;
  player.y = desiredY;
  if (player.y + player.size > canvas.height)
    player.y = canvas.height - player.size;
  if (player.y < 0) player.y = 0;
}

function movePlayer() {
  if (!gameActive) return;

  let newX = player.x;
  if (keys.left) newX -= player.speed;
  if (keys.right) newX += player.speed;

  // Clamp to keep player fully inside canvas
  if (newX < 0) newX = 0;
  if (newX + player.size > canvas.width) newX = canvas.width - player.size;

  player.x = newX;

  // Maintain bottom position
  let desiredY = canvas.height - player.size - 5;
  if (desiredY < 0) desiredY = 0;
  player.y = desiredY;
}

// ========== GAME LOOP ==========
function gameLoop() {
  // Clear canvas with background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FEF2E0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw subtle grid
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.strokeStyle = "#e0cfb1";
    ctx.lineWidth = 0.5;
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Update game logic only if active
  if (gameActive) {
    movePlayer();
    updateFoods();
  }

  // Draw all elements
  drawPlayer();
  drawFoods();
  drawUI();

  // Draw game over dim effect if needed
  if (!gameActive) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#2c2c2c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(gameLoop);
}

// ========== INITIALIZATION ==========
function initGame() {
  // Set initial player position
  player.x = canvas.width / 2 - 30;
  player.y = canvas.height - player.size - 5;
  player.speed = 5;
  player.size = 60;

  // Ensure bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size;

  // Clear any existing spawn interval
  if (spawnInterval) clearInterval(spawnInterval);

  // Start spawn interval
  spawnInterval = setInterval(() => {
    if (gameActive) spawnFood();
  }, 950);
}

// ========== EVENT LISTENERS ==========
document.addEventListener("keydown", (e) => {
  if (!gameActive && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    e.preventDefault();
    return;
  }
  if (e.key === "ArrowLeft") {
    keys.left = true;
    e.preventDefault();
  }
  if (e.key === "ArrowRight") {
    keys.right = true;
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

// Start the game
initGame();
gameLoop();
