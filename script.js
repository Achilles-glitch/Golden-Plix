const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let plix, gravity, lift, velocity;
let pipes = [];
let frame = 0;
let score = 0;
let isGameOver = false;
let gameStarted = false;
let pipeGap = 150;
let pipeSpeed = 2;
let jumpPower = -8;

function showDifficulty() {
  document.getElementById("homeScreen").style.display = "none";
  document.getElementById("difficultyScreen").style.display = "flex";
}

function startGame(difficulty) {
  if (difficulty === "medium") {
    pipeGap = 130;
    pipeSpeed = 2.2;
    jumpPower = -8.5;
  } else if (difficulty === "hard") {
    pipeGap = 110;
    pipeSpeed = 2.5;
    jumpPower = -9;
  } else {
    pipeGap = 150;
    pipeSpeed = 2;
    jumpPower = -8;
  }
  document.getElementById("difficultyScreen").style.display = "none";
  document.getElementById("countdownScreen").style.display = "flex";
  countdown(3);
}

function countdown(num) {
  const countdownText = document.getElementById("countdownText");
  countdownText.innerText = num;
  if (num > 0) {
    setTimeout(() => countdown(num - 1), 1000);
  } else {
    document.getElementById("countdownScreen").style.display = "none";
    startGameplay();
  }
}

function startGameplay() {
  plix = {
    x: 80,
    y: canvas.height / 2,
    size: 20,
    color: "#FFD700"
  };
  gravity = 0.4;
  velocity = 0;
  pipes = [];
  score = 0;
  isGameOver = false;
  gameStarted = true;
  document.getElementById("score").innerText = "Score: 0";
  requestAnimationFrame(draw);
}

function draw() {
  if (!gameStarted) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  velocity += gravity;
  plix.y += velocity;

  if (plix.y + plix.size > canvas.height || plix.y < 0) {
    gameOver();
  }

  ctx.fillStyle = plix.color;
  ctx.fillRect(plix.x, plix.y, plix.size, plix.size);

  if (frame % 90 === 0) {
    const topHeight = Math.random() * (canvas.height - pipeGap - 80) + 20;
    pipes.push({
      x: canvas.width,
      top: topHeight,
      bottom: canvas.height - topHeight - pipeGap,
      width: 50
    });
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    const p = pipes[i];
    p.x -= pipeSpeed;

    ctx.fillStyle = "#008000";
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);

    if (
      plix.x < p.x + p.width &&
      plix.x + plix.size > p.x &&
      (plix.y < p.top || plix.y + plix.size > canvas.height - p.bottom)
    ) {
      gameOver();
    }

    if (p.x + p.width < plix.x && !p.passed) {
      p.passed = true;
      score++;
      document.getElementById("score").innerText = "Score: " + score;
    }

    if (p.x + p.width < 0) {
      pipes.splice(i, 1);
    }
  }

  frame++;
  if (!isGameOver) requestAnimationFrame(draw);
}

function gameOver() {
  isGameOver = true;
  gameStarted = false;
  document.getElementById("gameOverScreen").style.display = "flex";
  document.getElementById("finalScore").innerText = "Score: " + score;
}

function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  showDifficulty();
}

function goHome() {
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("homeScreen").style.display = "flex";
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") velocity = jumpPower;
});

document.addEventListener("touchstart", () => {
  if (gameStarted && !isGameOver) velocity = jumpPower;
});
