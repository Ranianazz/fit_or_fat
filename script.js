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

// Character selection
let selectedCharacter = "boy";

// Load images dynamically based on character
let playerImg = new Image();

function updateCharacterImage() {
  if (selectedCharacter === "boy") {
    playerImg.src = "boy1.png";
  } else if (selectedCharacter === "girl") {
    playerImg.src = "girl.png";
  } else if (selectedCharacter === "unicorn") {
    playerImg.src = "unicorn.png";
  }
  // Fallback: create colored canvas drawings for reliable display
  //createCharacterImage();
}

// function createCharacterImage() {
//   const offCanvas = document.createElement("canvas");
//   offCanvas.width = 60;
//   offCanvas.height = 60;
//   const offCtx = offCanvas.getContext("2d");

//   if (selectedCharacter === "boy") {
//     offCtx.fillStyle = "#FFD966";
//     offCtx.beginPath();
//     offCtx.arc(30, 28, 18, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.fillStyle = "#000";
//     offCtx.beginPath();
//     offCtx.arc(22, 24, 2.5, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.beginPath();
//     offCtx.arc(38, 24, 2.5, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.beginPath();
//     offCtx.arc(30, 35, 8, 0.1, Math.PI - 0.1);
//     offCtx.stroke();
//     offCtx.fillStyle = "#4285F4";
//     offCtx.fillRect(24, 42, 12, 18);
//   } else if (selectedCharacter === "girl") {
//     offCtx.fillStyle = "#FFB7C5";
//     offCtx.beginPath();
//     offCtx.arc(30, 26, 18, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.fillStyle = "#000";
//     offCtx.beginPath();
//     offCtx.arc(22, 22, 2.5, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.beginPath();
//     offCtx.arc(38, 22, 2.5, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.beginPath();
//     offCtx.arc(30, 33, 8, 0.1, Math.PI - 0.1);
//     offCtx.stroke();
//     offCtx.fillStyle = "#9C27B0";
//     offCtx.fillRect(24, 40, 12, 18);
//   } else {
//     offCtx.fillStyle = "#E0BBE4";
//     offCtx.beginPath();
//     offCtx.arc(30, 28, 18, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.fillStyle = "#000";
//     offCtx.beginPath();
//     offCtx.arc(22, 24, 2.5, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.beginPath();
//     offCtx.arc(38, 24, 2.5, 0, Math.PI * 2);
//     offCtx.fill();
//     offCtx.beginPath();
//     offCtx.arc(30, 35, 8, 0.1, Math.PI - 0.1);
//     offCtx.stroke();
//     offCtx.fillStyle = "#FFD700";
//     offCtx.beginPath();
//     offCtx.moveTo(55, 10);
//     offCtx.lineTo(65, 3);
//     offCtx.lineTo(60, 15);
//     offCtx.fill();
//     offCtx.fillStyle = "#FF6B6B";
//     offCtx.fillRect(24, 42, 12, 18);
//   }
//   playerImg.src = offCanvas.toDataURL();
// }

const saladImg = new Image();
saladImg.src = "salad1.png";

const burgerImg = new Image();
burgerImg.src = "hamburger.png";

let spawnInterval = null;

// Start Screen Logic
const startScreen = document.getElementById("startScreen");
const gameWrapper = document.getElementById("gameWrapper");
const playGameBtn = document.getElementById("playGameBtn");
const charCards = document.querySelectorAll(".char-card");

charCards.forEach((card) => {
  card.addEventListener("click", () => {
    charCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedCharacter = card.getAttribute("data-character");
    playGameBtn.disabled = false;
  });
});

playGameBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameWrapper.style.display = "flex";
  gameWrapper.style.flexDirection = "column";
  gameWrapper.style.alignItems = "center";
  updateCharacterImage();
  initGame();
  resetGame();
  gameActive = true;
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (gameActive) spawnFood();
  }, 950);
});

// Game Over Functions
function showGameOverlay() {
  const existingOverlay = document.getElementById("dynamicOverlay");
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = "dynamicOverlay";
  overlay.className = "game-overlay";

  const banner = document.createElement("div");
  banner.className = "game-over-banner";
  banner.innerText = "💀 GAME OVER 💀";

  const burgerCountMsg = document.createElement("div");
  burgerCountMsg.innerText = `🍔 Burgers caught: ${burgerHitCount} / 3 🍔`;
  burgerCountMsg.style.color = "#ffdab9";
  burgerCountMsg.style.fontSize = "1.4rem";
  burgerCountMsg.style.fontWeight = "bold";
  burgerCountMsg.style.backgroundColor = "#00000088";
  burgerCountMsg.style.padding = "6px 16px";
  burgerCountMsg.style.borderRadius = "32px";

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

  const gameContainer = document.querySelector(".game-container");
  gameContainer.appendChild(overlay);
}

function triggerGameOver() {
  if (!gameActive) return;
  gameActive = false;
  document.getElementById("status").innerHTML =
    "💀 GAME OVER! You ate 3 burgers! Click PLAY AGAIN 💀";
  showGameOverlay();
}

function resetGame() {
  const overlay = document.getElementById("dynamicOverlay");
  if (overlay) overlay.remove();

  player = {
    x: canvas.width / 2 - 30,
    y: canvas.height - 65,
    width: 50,
    height: 60,
    speed: 5,
    size: 60,
  };

  if (player.x < 0) player.x = 0;
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size;
  if (player.y + player.size > canvas.height)
    player.y = canvas.height - player.size;
  if (player.y < 0) player.y = 0;

  foods = [];
  score = 0;
  burgerHitCount = 0;
  gameActive = true;

  document.getElementById("status").innerHTML =
    "✨ Game restarted! Avoid 3 burgers! ✨";

  keys.left = false;
  keys.right = false;
}

function spawnFood() {
  if (!gameActive) return;
  const isHealthy = Math.random() > 0.9;
  foods.push({
    x: Math.random() * (canvas.width - 50),
    y: -40,
    size: 50,
    speed: 2.2 + Math.random() * 2.5,
    healthy: isHealthy,
  });
}

function drawPlayer() {
  let drawX = player.x;
  let drawY = player.y;
  if (drawX < 0) drawX = 0;
  if (drawX + player.size > canvas.width) drawX = canvas.width - player.size;
  if (drawY < 0) drawY = 0;
  if (drawY + player.size > canvas.height) drawY = canvas.height - player.size;

  if (playerImg.complete && playerImg.src) {
    ctx.drawImage(playerImg, drawX, drawY, player.size, player.size);
  } else {
    ctx.fillStyle = "#FFD966";
    ctx.fillRect(drawX, drawY, player.size, player.size);
  }

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
  ctx.fillStyle = "#272343";
  ctx.font = "bold 24px 'Segoe UI'";
  ctx.fillText("🍎 " + score, 18, 48);

  ctx.fillStyle = "#f4a261";
  ctx.font = "bold 18px monospace";
  ctx.fillText("🍔 " + burgerHitCount + "/3", canvas.width - 100, 45);

  ctx.font = "12px 'Segoe UI'";
  ctx.fillStyle = "#2b3b36";
  ctx.fillText("speed: " + player.speed.toFixed(1), 12, 85);
  ctx.fillText("size: " + Math.floor(player.size), 12, 105);
}

function updateFoods() {
  if (!gameActive) return;

  for (let i = foods.length - 1; i >= 0; i--) {
    const food = foods[i];
    food.y += food.speed;

    if (
      food.x < player.x + player.size &&
      food.x + food.size > player.x &&
      food.y < player.y + player.size &&
      food.y + food.size > player.y
    ) {
      if (food.healthy) {
        player.speed += 0.35;
        if (player.speed > 12) player.speed = 12;
        player.size = Math.max(38, player.size - 1.5);
        score += 1;
        document.getElementById("status").innerHTML =
          "🥗 HEALTHY! +1 🥗 | Speed↑ Size↓";
      } else {
        player.speed = Math.max(2.2, player.speed - 0.7);
        player.size = Math.min(90, player.size + 2.5);
        score -= 1;
        burgerHitCount++;

        document.getElementById("status").innerHTML =
          `🍔 JUNK! -1 pts | Burgers: ${burgerHitCount}/3 🍔 | Slower & Bigger!`;

        if (burgerHitCount >= 3) {
          triggerGameOver();
          return;
        }
      }
      foods.splice(i, 1);
      continue;
    }

    if (food.y > canvas.height + 100) {
      foods.splice(i, 1);
    }
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size;

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
  if (newX < 0) newX = 0;
  if (newX + player.size > canvas.width) newX = canvas.width - player.size;
  player.x = newX;
  let desiredY = canvas.height - player.size - 5;
  if (desiredY < 0) desiredY = 0;
  player.y = desiredY;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FEF2E0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  if (gameActive) {
    movePlayer();
    updateFoods();
  }

  drawPlayer();
  drawFoods();
  drawUI();

  if (!gameActive) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#2c2c2c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(gameLoop);
}

function initGame() {
  player.x = canvas.width / 2 - 30;
  player.y = canvas.height - player.size - 5;
  player.speed = 5;
  player.size = 60;
  if (player.x < 0) player.x = 0;
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size;
}

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

// Start the game loop immediately (canvas is ready)
gameLoop();
