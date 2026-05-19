// Canvas elements
const canvas = document.getElementById("gameCanvas"); // Reference: Gets canvas element by ID (MDN - document.getElementById)
const ctx = canvas.getContext("2d"); // Reference: Gets 2D rendering context (MDN - CanvasRenderingContext2D)

// Game state
let player = {
  // Reference: Declares player object with properties (JavaScript Object Literal)
  x: 175,
  y: 530,
  width: 50,
  height: 60,
  speed: 5,
  size: 60,
};

let foods = []; // Reference: Empty array to store falling food items (MDN - Array)
let score = 0; // Reference: Initializes score variable (JavaScript Variables)
let burgerHitCount = 0; // Reference: Tracks number of burgers caught (JavaScript Variables)
let gameActive = true; // Reference: Boolean flag for game state (JavaScript Booleans)

// Controls
let keys = { left: false, right: false }; // Reference: Object to track keyboard input state (JavaScript Object)

// Load images
const playerImg = new Image(); // Reference: Creates new Image object (MDN - HTMLImageElement)
playerImg.src = "boy1.png"; // Reference: Sets image source (MDN - Image.src)

const saladImg = new Image(); // Reference: Creates salad image object (MDN - HTMLImageElement)
saladImg.src = "salad1.png"; // Reference: Sets salad image source

const burgerImg = new Image(); // Reference: Creates burger image object (MDN - HTMLImageElement)
burgerImg.src = "hamburger.png"; // Reference: Sets burger image source

// Food spawn interval variable
let spawnInterval = null; // Reference: Variable to store setInterval ID (MDN - setInterval)

// ========== GAME OVER OVERLAY FUNCTIONS ==========
function showGameOverlay() {
  // Reference: Function declaration (MDN - Functions)
  // Remove existing overlay if any
  const existingOverlay = document.getElementById("dynamicOverlay");
  // Reference: Checks for existing overlay (MDN - getElementById)
  if (existingOverlay) existingOverlay.remove(); // Reference: Removes DOM element if exists (MDN - Node.remove())

  // Create overlay element
  const overlay = document.createElement("div"); // Reference: Creates new div element (MDN - document.createElement)
  overlay.id = "dynamicOverlay"; // Reference: Sets element ID (MDN - Element.id)
  overlay.className = "game-overlay"; // Reference: Assigns CSS class (MDN - Element.className)

  // Banner
  const banner = document.createElement("div"); // Reference: Creates banner div (MDN - createElement)
  banner.className = "game-over-banner"; // Reference: Sets banner class (MDN)
  banner.innerText = "💀 GAME OVER 💀"; // Reference: Sets text content (MDN - Node.innerText)

  // Burger count message
  const burgerCountMsg = document.createElement("div"); // Reference: Creates message element (MDN)
  burgerCountMsg.innerText = `🍔 Burgers caught: ${burgerHitCount} / 5 🍔`;
  // Reference: Uses template literal (MDN - Template literals)
  burgerCountMsg.style.color = "#ffdab9"; // Reference: Inline CSS styling (MDN - HTMLElement.style)
  burgerCountMsg.style.fontSize = "1.4rem"; // Reference: Inline style (MDN)
  burgerCountMsg.style.fontWeight = "bold"; // Reference: Inline style (MDN)
  burgerCountMsg.style.backgroundColor = "#00000088"; // Reference: Inline style with rgba (MDN)
  burgerCountMsg.style.padding = "6px 16px"; // Reference: Inline style (MDN)
  burgerCountMsg.style.borderRadius = "32px"; // Reference: Inline style (MDN)

  // Play again button
  const playBtn = document.createElement("button"); // Reference: Creates button element (MDN)
  playBtn.innerText = "🔄 PLAY AGAIN 🔄"; // Reference: Sets button text (MDN)
  playBtn.className = "play-again-btn"; // Reference: Assigns CSS class (MDN)

  playBtn.addEventListener("click", (e) => {
    // Reference: Adds click event listener (MDN - EventTarget.addEventListener)
    e.stopPropagation(); // Reference: Stops event bubbling (MDN - Event.stopPropagation)
    resetGame(); // Reference: Calls reset function
  });

  overlay.appendChild(banner); // Reference: Appends child element (MDN - Node.appendChild)
  overlay.appendChild(burgerCountMsg);
  overlay.appendChild(playBtn);

  // Attach to game container
  const gameContainer = document.querySelector(".game-container");
  // Reference: Selects container by class (MDN - document.querySelector)
  gameContainer.appendChild(overlay); // Reference: Appends overlay to container (MDN)
}

function triggerGameOver() {
  // Reference: Function to end the game (JavaScript Functions)
  if (!gameActive) return; // Reference: Early return guard clause
  gameActive = false; // Reference: Sets game state to inactive
  document.getElementById("status").innerHTML = // Reference: Updates status message (MDN)
    "💀 GAME OVER! You ate 5 burgers! Click PLAY AGAIN 💀";
  showGameOverlay(); // Reference: Calls overlay function
}

// ========== RESET GAME ==========
function resetGame() {
  // Reference: Function to reset game state
  // Remove overlay
  const overlay = document.getElementById("dynamicOverlay"); // Reference: Gets overlay element
  if (overlay) overlay.remove(); // Reference: Removes overlay

  // Reset player to original state
  player = {
    // Reference: Reassigns player object
    x: canvas.width / 2 - 30,
    y: canvas.height - 65,
    width: 50,
    height: 60,
    speed: 5,
    size: 60,
  };

  // Ensure player stays within bounds
  if (player.x < 0) player.x = 0; // Reference: Boundary checking
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size;
  if (player.y + player.size > canvas.height)
    player.y = canvas.height - player.size;
  if (player.y < 0) player.y = 0;

  // Reset game variables
  foods = []; // Reference: Clears foods array
  score = 0; // Reference: Resets score
  burgerHitCount = 0; // Reference: Resets burger counter
  gameActive = true; // Reference: Reactivates game

  // Reset status message
  document.getElementById("status").innerHTML = // Reference: Updates DOM text
    "✨ Game restarted! Avoid 5 burgers! ✨";

  // Reset controls
  keys.left = false; // Reference: Resets key states
  keys.right = false;
}

// ========== SPAWN FOOD ==========
function spawnFood() {
  // Reference: Function to create new food item
  if (!gameActive) return; // Reference: Guard clause

  const isHealthy = Math.random() > 0.5; // Reference: Random boolean (MDN - Math.random)

  foods.push({
    // Reference: Adds new object to array (MDN - Array.push)
    x: Math.random() * (canvas.width - 50),
    y: -40,
    size: 50,
    speed: 2.2 + Math.random() * 2.5,
    healthy: isHealthy,
  });
}

// ========== DRAW FUNCTIONS ==========
function drawPlayer() {
  // Reference: Draws player image
  let drawX = player.x; // Reference: Local variable for clamping
  let drawY = player.y;

  // Clamp drawing position to keep full image within canvas
  if (drawX < 0) drawX = 0; // Reference: Boundary clamping
  if (drawX + player.size > canvas.width) drawX = canvas.width - player.size;
  if (drawY < 0) drawY = 0;
  if (drawY + player.size > canvas.height) drawY = canvas.height - player.size;

  ctx.drawImage(playerImg, drawX, drawY, player.size, player.size);
  // Reference: Draws image on canvas (MDN - CanvasRenderingContext2D.drawImage)

  // Draw subtle outline
  ctx.save(); // Reference: Saves canvas state (MDN)
  ctx.shadowBlur = 0; // Reference: Disables shadow
  ctx.strokeStyle = "#FFB347"; // Reference: Sets stroke color
  ctx.lineWidth = 1.5; // Reference: Sets line width
  ctx.strokeRect(drawX, drawY, player.size, player.size); // Reference: Draws rectangle outline (MDN)
  ctx.restore(); // Reference: Restores canvas state
}

function drawFoods() {
  // Reference: Draws all food items
  foods.forEach((food) => {
    // Reference: Iterates array (MDN - Array.forEach)
    if (food.healthy) {
      ctx.drawImage(saladImg, food.x, food.y, food.size, food.size);
    } else {
      ctx.drawImage(burgerImg, food.x, food.y, food.size, food.size);
    }
  });
}

function drawUI() {
  // Reference: Draws score and UI elements
  // Score
  ctx.fillStyle = "#272343"; // Reference: Sets fill color
  ctx.font = "bold 24px 'Segoe UI'"; // Reference: Sets font (MDN)
  ctx.fillText("🍎 " + score, 18, 48); // Reference: Draws text (MDN - fillText)

  // Burger counter
  ctx.fillStyle = "#f4a261";
  ctx.font = "bold 18px monospace";
  ctx.fillText("🍔 " + burgerHitCount + "/5", canvas.width - 100, 45);

  // Speed and size info
  ctx.font = "12px 'Segoe UI'";
  ctx.fillStyle = "#2b3b36";
  ctx.fillText("speed: " + player.speed.toFixed(1), 12, 85); // Reference: Uses toFixed() (MDN - Number.toFixed)
  ctx.fillText("size: " + Math.floor(player.size), 12, 105); // Reference: Uses Math.floor (MDN)
}

// ========== UPDATE LOGIC ==========
function updateFoods() {
  // Reference: Updates food positions and collisions
  if (!gameActive) return;

  for (let i = foods.length - 1; i >= 0; i--) {
    // Reference: Backward loop for safe splicing
    const food = foods[i];
    food.y += food.speed; // Reference: Moves food downward

    // Collision detection
    if (
      food.x < player.x + player.size &&
      food.x + food.size > player.x &&
      food.y < player.y + player.size &&
      food.y + food.size > player.y
    ) {
      if (food.healthy) {
        player.speed += 0.35; // Reference: Increases speed on healthy food
        if (player.speed > 12) player.speed = 12;
        player.size = Math.max(38, player.size - 1.5); // Reference: Math.max (MDN)
        score += 10;
        document.getElementById("status").innerHTML =
          "🥗 HEALTHY! +10 🥗 | Speed↑ Size↓";
      } else {
        player.speed = Math.max(2.2, player.speed - 0.7);
        player.size = Math.min(90, player.size + 2.5); // Reference: Math.min (MDN)
        score -= 5;
        burgerHitCount++;

        document.getElementById("status").innerHTML =
          `🍔 JUNK! -5 pts | Burgers: ${burgerHitCount}/5 🍔 | Slower & Bigger!`;

        if (burgerHitCount >= 5) {
          triggerGameOver();
          return;
        }
      }
      foods.splice(i, 1); // Reference: Removes item from array
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
  // Reference: Handles player movement
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
  // Reference: Main animation loop
  // Clear canvas with background
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Reference: Clears canvas (MDN)
  ctx.fillStyle = "#FEF2E0";
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Reference: Fills background

  // Draw subtle grid
  for (let i = 0; i < canvas.width; i += 40) {
    // Reference: For loop for grid lines
    ctx.beginPath(); // Reference: Starts new path (MDN)
    ctx.strokeStyle = "#e0cfb1";
    ctx.lineWidth = 0.5;
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke(); // Reference: Draws line
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
    ctx.globalAlpha = 0.5; // Reference: Sets transparency
    ctx.fillStyle = "#2c2c2c";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1; // Reference: Resets alpha
  }

  requestAnimationFrame(gameLoop); // Reference: Requests next animation frame (MDN)
}

// ========== INITIALIZATION ==========
function initGame() {
  // Reference: Game setup function
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
  if (spawnInterval) clearInterval(spawnInterval); // Reference: Clears previous interval (MDN)

  // Start spawn interval
  spawnInterval = setInterval(() => {
    // Reference: Starts repeating timer
    if (gameActive) spawnFood();
  }, 950);
}

// ========== EVENT LISTENERS ==========
document.addEventListener("keydown", (e) => {
  // Reference: Keyboard down listener (MDN)
  if (!gameActive && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    e.preventDefault();
    return;
  }
  if (e.key === "ArrowLeft") {
    keys.left = true;
    e.preventDefault(); // Reference: Prevents default browser behavior
  }
  if (e.key === "ArrowRight") {
    keys.right = true;
    e.preventDefault();
  }
});

document.addEventListener("keyup", (e) => {
  // Reference: Keyboard up listener
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

// Start the game
initGame(); // Reference: Calls initialization
gameLoop(); // Reference: Starts game loop
