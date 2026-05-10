const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.width = 800;
canvas.height = 400;

const chihuahua = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    color: "#f0a500",
    velocityY: 0,
    jumpPower: -15,
    gravity: 1,
    isJumping: false,
};

const obstacles = [];
const obstacleTypes = ["gray", "tabby", "black"];

function createObstacle() {
    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const obstacle = {
        x: canvas.width,
        y: 300,
        width: 50,
        height: 50,
        color: type === "gray" ? "#808080" : type === "tabby" ? "#d2691e" : "#000",
    };
    obstacles.push(obstacle);
}

let score = 0;
let gameOver = false;

function update() {
    if (gameOver) return;

    // Update chihuahua
    chihuahua.velocityY += chihuahua.gravity;
    chihuahua.y += chihuahua.velocityY;

    if (chihuahua.y > 300) {
        chihuahua.y = 300;
        chihuahua.isJumping = false;
    }

    // Update obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= 5;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        // Check collision
        if (
            chihuahua.x < obstacle.x + obstacle.width &&
            chihuahua.x + chihuahua.width > obstacle.x &&
            chihuahua.y < obstacle.y + obstacle.height &&
            chihuahua.y + chihuahua.height > obstacle.y
        ) {
            gameOver = true;
        }
    });

    // Spawn new obstacle
    if (Math.random() < 0.02) {
        createObstacle();
    }
}

function draw() {
    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
        ctx.fillText(`Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 50);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw chihuahua
    ctx.fillStyle = chihuahua.color;
    ctx.fillRect(chihuahua.x, chihuahua.y, chihuahua.width, chihuahua.height);

    // Draw obstacles
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !chihuahua.isJumping) {
        chihuahua.velocityY = chihuahua.jumpPower;
        chihuahua.isJumping = true;
    }
});

gameLoop();