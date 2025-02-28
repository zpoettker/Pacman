const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dynamic canvas sizing
function resizeCanvas() {
    const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const rows = 20;
const cols = 20;

const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let pacman = {
    gridX: 9,
    gridY: 17,
    x: 9 * (canvas.width / 20),
    y: 17 * (canvas.width / 20),
    targetX: 9 * (canvas.width / 20),
    targetY: 17 * (canvas.width / 20),
    direction: 0,
    pendingDirection: null,
    moving: false,
    moveFrames: 10
};

let ghosts = [
    { gridX: 8, gridY: 9, x: 8 * (canvas.width / 20), y: 9 * (canvas.width / 20), targetX: 8 * (canvas.width / 20), targetY: 9 * (canvas.width / 20), color: "red", originalColor: "red", direction: 0, moving: false, moveFrames: 12, scared: false, state: "exiting", overlapTimer: 0 },
    { gridX: 9, gridY: 9, x: 9 * (canvas.width / 20), y: 9 * (canvas.width / 20), targetX: 9 * (canvas.width / 20), targetY: 9 * (canvas.width / 20), color: "pink", originalColor: "pink", direction: 0, moving: false, moveFrames: 12, scared: false, state: "exiting", overlapTimer: 0 },
    { gridX: 10, gridY: 9, x: 10 * (canvas.width / 20), y: 9 * (canvas.width / 20), targetX: 10 * (canvas.width / 20), targetY: 9 * (canvas.width / 20), color: "cyan", originalColor: "cyan", direction: 0, moving: false, moveFrames: 12, scared: false, state: "exiting", overlapTimer: 0 },
    { gridX: 11, gridY: 9, x: 11 * (canvas.width / 20), y: 9 * (canvas.width / 20), targetX: 11 * (canvas.width / 20), targetY: 9 * (canvas.width / 20), color: "orange", originalColor: "orange", direction: 2, moving: false, moveFrames: 12, scared: false, state: "exiting", overlapTimer: 0 }
];

let pellets = [];
let powerPellets = [];
let allPellets = [];
function updatePellets() {
    const tileSize = canvas.width / 20;
    pellets = [];
    powerPellets = [];
    allPellets = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 0) {
                let pellet = { x: x * tileSize + tileSize / 2, y: y * tileSize + tileSize / 2 };
                pellets.push(pellet);
                allPellets.push(pellet);
            } else if (maze[y][x] === 2) {
                powerPellets.push({ x: x * tileSize + tileSize / 2, y: y * tileSize + tileSize / 2 });
            }
        }
    }
}
updatePellets();

let score = 0;
let lives = 3;
let gameOver = false;
let powerMode = false;
let powerTimer = 0;
const powerDuration = 600;
const blinkDurationSeconds = 3;
let blinkTimer = 0;
let fruit = null;
let fruitTimer = 0;
const fruitSpawnInterval = 600;
const fruitDuration = 540;
let bonusText = null;
let levelComplete = false;
let levelCompleteTimer = 0;
const levelBlinkDuration = 120;
let blinkState = true;
let gameOverTimer = 0;
const gameOverDelay = 120;
let highScoreScreen = false;
let highScores = [];
let deathFreeze = false;
let deathFreezeTimer = 0;
const deathFreezeDuration = 90;
let speedMultiplier = 1.0;

const overlapThreshold = 60;

const wackaSound = new Audio("src/wacka.mp3");
wackaSound.loop = false;
let lastWackaTime = 0;
const wackaInterval = 200;

const soundtrack = new Audio("src/soundtrack.mp3");
soundtrack.loop = true;
soundtrack.volume = 0.5;

const deathSound = new Audio("src/deathsound.mp3");
deathSound.loop = false;

function preloadAudio() {
    wackaSound.load();
    soundtrack.load();
    deathSound.load();
}

function resetGame() {
    const tileSize = canvas.width / 20;
    score = 0;
    lives = 3;
    gameOver = false;
    highScoreScreen = false;
    gameOverTimer = 0;
    updatePellets();
    pacman.gridX = 9;
    pacman.gridY = 17;
    pacman.x = 9 * tileSize;
    pacman.y = 17 * tileSize;
    pacman.targetX = pacman.x;
    pacman.targetY = pacman.y;
    pacman.moving = false;
    pacman.pendingDirection = null;
    pacman.moveFrames = 10;

    ghosts.forEach((g, index) => {
        g.gridX = 8 + index;
        g.gridY = 9;
        g.x = (8 + index) * tileSize;
        g.y = 9 * tileSize;
        g.targetX = g.x;
        g.targetY = g.y;
        g.moving = false;
        g.state = "exiting";
        g.direction = (g.originalColor === "orange") ? 2 : 0;
        g.scared = false;
        g.color = g.originalColor;
        g.overlapTimer = 0;
        g.moveFrames = 12;
    });

    powerMode = false;
    powerTimer = 0;
    blinkTimer = 0;
    fruit = null;
    fruitTimer = 0;
    levelComplete = false;
    levelCompleteTimer = 0;
    deathFreeze = false;
    deathFreezeTimer = 0;
    speedMultiplier = 1.0;

    soundtrack.play().catch(error => console.log("Soundtrack play failed:", error));
}

function resetLevel() {
    const tileSize = canvas.width / 20;
    updatePellets();
    pacman.gridX = 9;
    pacman.gridY = 17;
    pacman.x = 9 * tileSize;
    pacman.y = 17 * tileSize;
    pacman.targetX = pacman.x;
    pacman.targetY = pacman.y;
    pacman.moving = false;
    pacman.pendingDirection = null;

    ghosts.forEach((g, index) => {
        g.gridX = 8 + index;
        g.gridY = 9;
        g.x = (8 + index) * tileSize;
        g.y = 9 * tileSize;
        g.targetX = g.x;
        g.targetY = g.y;
        g.moving = false;
        g.state = "exiting";
        g.direction = (g.originalColor === "orange") ? 2 : 0;
        g.scared = false;
        g.color = g.originalColor;
        g.overlapTimer = 0;
    });

    powerMode = false;
    powerTimer = 0;
    blinkTimer = 0;
    fruit = null;
    fruitTimer = 0;
    levelComplete = false;
    levelCompleteTimer = 0;
    deathFreeze = false;
    deathFreezeTimer = 0;

    speedMultiplier *= 1.3;
    pacman.moveFrames = Math.max(1, Math.round(10 / speedMultiplier));
    ghosts.forEach(g => g.moveFrames = Math.max(1, Math.round(12 / speedMultiplier)));
}

function spawnFruit() {
    const tileSize = canvas.width / 20;
    if (!fruit) {
        const openSpots = [];
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (maze[y][x] === 0) openSpots.push({ x, y });
            }
        }
        if (openSpots.length > 0) {
            const spot = openSpots[Math.floor(Math.random() * openSpots.length)];
            fruit = { gridX: spot.x, gridY: spot.y, x: spot.x * tileSize, y: spot.y * tileSize, timer: fruitDuration };
        }
    }
}

function drawMaze() {
    const tileSize = canvas.width / 20;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = "blue";
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }
}

function drawPacman() {
    const tileSize = canvas.width / 20;
    ctx.beginPath();
    ctx.arc(pacman.x + tileSize / 2, pacman.y + tileSize / 2, tileSize / 2 - 2, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.lineTo(pacman.x + tileSize / 2, pacman.y + tileSize / 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

function drawGhosts() {
    const tileSize = canvas.width / 20;
    for (let ghost of ghosts) {
        let ghostColor = ghost.scared ? "blue" : ghost.color;
        if (ghost.scared && powerMode && powerTimer <= blinkDurationSeconds * 60) {
            ghostColor = (blinkTimer % 30 < 15) ? "blue" : "white";
        }
        ctx.fillStyle = ghostColor;
        ctx.beginPath();
        ctx.arc(ghost.x + tileSize / 2, ghost.y + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2);
        ctx.fillRect(ghost.x + 2, ghost.y + tileSize / 2 - 2, tileSize - 4, tileSize / 2);
        ctx.fill();
    }
}

function drawPellets() {
    const tileSize = canvas.width / 20;
    ctx.fillStyle = "white";
    if (levelComplete && levelCompleteTimer > 0) {
        if (blinkState) {
            for (let pellet of allPellets) {
                ctx.beginPath();
                ctx.arc(pellet.x, pellet.y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    } else {
        for (let pellet of pellets) {
            ctx.beginPath();
            ctx.arc(pellet.x, pellet.y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    for (let powerPellet of powerPellets) {
        ctx.beginPath();
        ctx.arc(powerPellet.x, powerPellet.y, 6, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawScoreAndLives() {
    ctx.fillStyle = "white";
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillText(`Score: ${score}`, 10, 20);

    const livesX = canvas.width - 100;
    const livesY = 20;
    ctx.fillStyle = "white";
    ctx.font = "12px 'Press Start 2P'";
    ctx.fillText(`Lives: ${lives}`, livesX, livesY);

    if (gameOver && !highScoreScreen) {
        ctx.fillStyle = "black";
        const boxWidth = 195;
        const boxHeight = 50;
        const boxX = (canvas.width - boxWidth) / 2;
        const boxY = (canvas.height - boxHeight) / 2;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

        ctx.fillStyle = "red";
        ctx.font = "20px 'Press Start 2P'";
        const textWidth = ctx.measureText("GAME OVER").width;
        const textX = boxX + (boxWidth - textWidth) / 2;
        const textY = boxY + boxHeight / 2 + 10;
        ctx.fillText("GAME OVER", textX, textY);
    }

    if (bonusText) {
        ctx.fillStyle = "white";
        ctx.font = "14px 'Press Start 2P'";
        ctx.fillText("+100", pacman.x, pacman.y - 10);
        bonusText.timer--;
        if (bonusText.timer <= 0) {
            bonusText = null;
        }
    }
}

function drawHighScoreScreen() {
    ctx.fillStyle = "#333333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "16px 'Press Start 2P'";
    ctx.fillText("High Scores", canvas.width / 2 - 70, 50);

    ctx.font = "10px 'Press Start 2P'";
    for (let i = 0; i < Math.min(highScores.length, 5); i++) {
        ctx.fillText(`${i + 1}. ${highScores[i].name}: ${highScores[i].score}`, canvas.width / 2 - 80, 100 + i * 30);
    }
}

function draw() {
    const tileSize = canvas.width / 20;
    if (highScoreScreen) {
        drawHighScoreScreen();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMaze();
        drawPellets();
        if (fruit) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(fruit.x + tileSize / 2, fruit.y + tileSize / 2, tileSize / 2 - 2, 0, 2 * Math.PI);
            ctx.fill();
        }
        drawGhosts();
        drawPacman();
        drawScoreAndLives();
    }
}

document.addEventListener("keydown", (event) => {
    if (!gameOver && !levelComplete && !deathFreeze) {
        let newDirection = null;
        switch (event.key) {
            case "ArrowRight": newDirection = 0; break;
            case "ArrowDown": newDirection = 1; break;
            case "ArrowLeft": newDirection = 2; break;
            case "ArrowUp": newDirection = 3; break;
        }
        if (newDirection !== null) {
            event.preventDefault();
            pacman.pendingDirection = newDirection;
            if (!pacman.moving) {
                pacman.direction = newDirection;
                attemptMove(pacman, newDirection);
            }
        }
    }
});

function attemptMove(character, direction) {
    const tileSize = canvas.width / 20;
    let nextGridX = character.gridX;
    let nextGridY = character.gridY;

    if (direction === 0) nextGridX += 1;
    if (direction === 1) nextGridY += 1;
    if (direction === 2) nextGridX -= 1;
    if (direction === 3) nextGridY -= 1;

    let isWormhole = (character.gridY === 9);
    if (isWormhole && (nextGridX < 0 || nextGridX >= cols)) {
        character.direction = direction;
        character.targetX = nextGridX * tileSize;
        character.targetY = nextGridY * tileSize;
        character.gridX = nextGridX;
        character.gridY = nextGridY;
        character.moving = true;
        character.frameCount = 0;
        if (character === pacman && character.pendingDirection === direction) {
            character.pendingDirection = null;
        }
        return true;
    }

    if (nextGridX >= 0 && nextGridX < cols && nextGridY >= 0 && nextGridY < rows) {
        if (maze[nextGridY][nextGridX] !== 1) {
            character.direction = direction;
            character.targetX = nextGridX * tileSize;
            character.targetY = nextGridY * tileSize;
            character.gridX = nextGridX;
            character.gridY = nextGridY;
            character.moving = true;
            character.frameCount = 0;
            if (character === pacman && character.pendingDirection === direction) {
                character.pendingDirection = null;
            }
            return true;
        }
    }
    return false;
}

function animateCharacter(character) {
    if (character.moving) {
        character.frameCount++;
        let progress = character.frameCount / character.moveFrames;
        if (progress >= 1) {
            character.x = character.targetX;
            character.y = character.targetY;
            character.moving = false;

            if (character.gridY === 9) {
                const tileSize = canvas.width / 20;
                if (character.gridX < 0) {
                    character.gridX = cols - 1;
                    character.x = (cols - 1) * tileSize;
                    character.targetX = character.x;
                } else if (character.gridX >= cols) {
                    character.gridX = 0;
                    character.x = 0;
                    character.targetX = character.x;
                }
            }

            if (character === pacman) {
                if (pacman.pendingDirection !== null && attemptMove(character, pacman.pendingDirection)) {
                    // Move succeeded
                } else {
                    attemptMove(character, character.direction);
                }
            }
        } else {
            character.x = character.x + (character.targetX - character.x) * (1 / (character.moveFrames - character.frameCount));
            character.y = character.y + (character.targetY - character.y) * (1 / (character.moveFrames - character.frameCount));
        }
    }
}

function movePacman() {
    const tileSize = canvas.width / 20;
    if (!deathFreeze) {
        if (!pacman.moving) {
            if (pacman.pendingDirection !== null && attemptMove(pacman, pacman.pendingDirection)) {
                // Move succeeded
            } else {
                attemptMove(pacman, pacman.direction);
            }
        }
        animateCharacter(pacman);

        pellets = pellets.filter(pellet => {
            let dx = pellet.x - (pacman.x + tileSize / 2);
            let dy = pellet.y - (pacman.y + tileSize / 2);
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= tileSize / 2) {
                score += 10;
                const currentTime = Date.now();
                if (currentTime - lastWackaTime >= wackaInterval) {
                    wackaSound.currentTime = 0;
                    wackaSound.play().catch(error => console.log("Wacka play failed:", error));
                    lastWackaTime = currentTime;
                }
                return false;
            }
            return true;
        });

        powerPellets = powerPellets.filter(powerPellet => {
            let dx = powerPellet.x - (pacman.x + tileSize / 2);
            let dy = powerPellet.y - (pacman.y + tileSize / 2);
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= tileSize / 2) {
                score += 50;
                powerMode = true;
                powerTimer = powerDuration;
                ghosts.forEach(ghost => {
                    ghost.scared = true;
                    ghost.color = "blue";
                });
                return false;
            }
            return true;
        });
    }
}

function moveGhosts() {
    const tileSize = canvas.width / 20;
    if (powerMode) {
        powerTimer--;
        blinkTimer++;
        if (powerTimer <= 0) {
            powerMode = false;
            blinkTimer = 0;
            ghosts.forEach(ghost => {
                ghost.scared = false;
                ghost.color = ghost.originalColor;
            });
        }
    }

    if (!deathFreeze) {
        let overlapMap = new Map();
        ghosts.forEach((ghost, index) => {
            const key = `${ghost.gridX},${ghost.gridY}`;
            if (!overlapMap.has(key)) {
                overlapMap.set(key, []);
            }
            overlapMap.get(key).push(index);
        });

        let handledPairs = new Set();
        ghosts.forEach((ghost, index) => {
            const key = `${ghost.gridX},${ghost.gridY}`;
            const overlappingIndices = overlapMap.get(key);
            if (overlappingIndices.length === 2) {
                const otherIndex = overlappingIndices.find(i => i !== index);
                const pairKey = Math.min(index, otherIndex) + "-" + Math.max(index, otherIndex);
                if (!handledPairs.has(pairKey)) {
                    ghost.overlapTimer++;
                    const otherGhost = ghosts[otherIndex];
                    otherGhost.overlapTimer = ghost.overlapTimer;

                    if (ghost.overlapTimer >= overlapThreshold) {
                        const forwardGhost = ghost;
                        const reverseGhost = otherGhost;
                        const forwardDir = forwardGhost.direction;
                        const reverseDir = (reverseGhost.direction + 2) % 4;

                        if (attemptMove(forwardGhost, forwardDir)) {
                            forwardGhost.overlapTimer = 0;
                        }
                        if (attemptMove(reverseGhost, reverseDir)) {
                            reverseGhost.overlapTimer = 0;
                        }
                        handledPairs.add(pairKey);
                    }
                }
            } else {
                ghost.overlapTimer = 0;
            }
        });

        for (let ghost of ghosts) {
            if (!ghost.moving) {
                let directions = [];
                let validDirections = [];

                if (ghost.state === "exiting") {
                    if (ghost.originalColor === "orange" && ghost.gridX > 9) {
                        directions.push(2);
                    } else {
                        let dx = 9 - ghost.gridX;
                        let dy = 7 - ghost.gridY;
                        if (Math.abs(dx) > Math.abs(dy)) {
                            directions.push(dx > 0 ? 0 : 2);
                            directions.push(dy > 0 ? 1 : 3);
                        } else {
                            directions.push(dy > 0 ? 1 : 3);
                            directions.push(dx > 0 ? 0 : 2);
                        }
                    }
                    if (ghost.gridX === 9 && ghost.gridY === 7) {
                        ghost.state = "tracking";
                    }
                } else if (ghost.state === "tracking") {
                    if (!ghost.scared) {
                        let dx = pacman.gridX - ghost.gridX;
                        let dy = pacman.gridY - ghost.gridY;
                        if (Math.abs(dx) > Math.abs(dy)) {
                            directions.push(dx > 0 ? 0 : 2);
                            directions.push(dy > 0 ? 1 : 3);
                        } else {
                            directions.push(dy > 0 ? 1 : 3);
                            directions.push(dx > 0 ? 0 : 2);
                        }
                    } else {
                        let dx = pacman.gridX - ghost.gridX;
                        let dy = pacman.gridY - ghost.gridY;
                        if (Math.abs(dx) > Math.abs(dy)) {
                            directions.push(dx > 0 ? 2 : 0);
                            directions.push(dy > 0 ? 3 : 1);
                        } else {
                            directions.push(dy > 0 ? 3 : 1);
                            directions.push(dx > 0 ? 2 : 0);
                        }
                    }
                }

                for (let dir = 0; dir < 4; dir++) {
                    let reverseDir = (ghost.direction + 2) % 4;
                    if (dir === reverseDir && !(ghost.state === "tracking" && ((ghost.gridX === 7 && ghost.gridY === 9) || (ghost.gridX === 12 && ghost.gridY === 9)))) {
                        continue;
                    }

                    let nextGridX = ghost.gridX;
                    let nextGridY = ghost.gridY;
                    if (dir === 0) nextGridX += 1;
                    if (dir === 1) nextGridY += 1;
                    if (dir === 2) nextGridX -= 1;
                    if (dir === 3) nextGridY -= 1;

                    if (nextGridX < 0 && ghost.gridY === 9) nextGridX = cols - 1;
                    if (nextGridX >= cols && ghost.gridY === 9) nextGridX = 0;

                    if (nextGridX >= 0 && nextGridX < cols && nextGridY >= 0 && nextGridY < rows) {
                        if (maze[nextGridY][nextGridX] !== 1) {
                            validDirections.push(dir);
                        }
                    }
                }

                let moved = false;
                if (ghost.overlapTimer < overlapThreshold) {
                    for (let dir of directions) {
                        if (validDirections.includes(dir) && attemptMove(ghost, dir)) {
                            moved = true;
                            break;
                        }
                    }
                    if (!moved && validDirections.length > 0) {
                        let randomDir = validDirections[Math.floor(Math.random() * validDirections.length)];
                        attemptMove(ghost, randomDir);
                    }
                }
            }

            animateCharacter(ghost);

            let dx = ghost.x - pacman.x;
            let dy = ghost.y - pacman.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < tileSize) {
                if (ghost.scared) {
                    score += 200;
                    ghost.gridX = 9;
                    ghost.gridY = 9;
                    ghost.x = 9 * tileSize;
                    ghost.y = 9 * tileSize;
                    ghost.targetX = ghost.x;
                    ghost.targetY = ghost.y;
                    ghost.moving = false;
                    ghost.scared = false;
                    ghost.color = ghost.originalColor;
                    ghost.state = "exiting";
                    ghost.overlapTimer = 0;
                } else if (!gameOver && !deathFreeze) {
                    lives--;
                    deathSound.currentTime = 0;
                    deathSound.play().catch(error => console.log("Death sound play failed:", error));
                    soundtrack.pause();
                    deathFreeze = true;
                    deathFreezeTimer = deathFreezeDuration;

                    if (lives <= 0) {
                        lives = 0;
                        gameOver = true;
                        gameOverTimer = gameOverDelay;
                        soundtrack.pause();
                        soundtrack.currentTime = 0;
                    }
                }
            }
        }
    }
}

function update() {
    if (!gameOver) {
        if (!levelComplete) {
            if (deathFreeze) {
                deathFreezeTimer--;
                if (deathFreezeTimer <= 0) {
                    const tileSize = canvas.width / 20;
                    deathFreeze = false;
                    pacman.gridX = 9;
                    pacman.gridY = 17;
                    pacman.x = 9 * tileSize;
                    pacman.y = 17 * tileSize;
                    pacman.targetX = pacman.x;
                    pacman.targetY = pacman.y;
                    pacman.moving = false;
                    pacman.pendingDirection = null;

                    ghosts.forEach((g, index) => {
                        g.gridX = 8 + index;
                        g.gridY = 9;
                        g.x = (8 + index) * tileSize;
                        g.y = 9 * tileSize;
                        g.targetX = g.x;
                        g.targetY = g.y;
                        g.moving = false;
                        g.state = "exiting";
                        g.direction = (g.originalColor === "orange") ? 2 : 0;
                        g.overlapTimer = 0;
                    });
                    soundtrack.play().catch(error => console.log("Soundtrack play failed:", error));
                }
            } else {
                movePacman();
                moveGhosts();

                fruitTimer++;
                if (fruitTimer >= fruitSpawnInterval && !fruit) {
                    spawnFruit();
                    fruitTimer = 0;
                }
                if (fruit) {
                    fruit.timer--;
                    if (fruit.timer <= 0) {
                        fruit = null;
                    }
                }

                if (fruit) {
                    const tileSize = canvas.width / 20;
                    let dx = fruit.x + tileSize / 2 - (pacman.x + tileSize / 2);
                    let dy = fruit.y + tileSize / 2 - (pacman.y + tileSize / 2);
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < tileSize / 2) {
                        score += 100;
                        fruit = null;
                        bonusText = { timer: 60 };
                    }
                }

                if (pellets.length === 0) {
                    levelComplete = true;
                    levelCompleteTimer = levelBlinkDuration;
                    updatePellets();
                    soundtrack.pause();
                    soundtrack.currentTime = 0;
                }
            }

            if (!document.getElementById("testButton") && !deathFreeze) {
                const testButton = document.createElement("button");
                testButton.id = "testButton";
                testButton.textContent = "Test Level Complete (1 Pellet)";
                document.body.appendChild(testButton);
                testButton.addEventListener("click", () => {
                    if (!gameOver && !levelComplete && !deathFreeze) {
                        const lastPellet = pellets[pellets.length - 1];
                        pellets = [lastPellet];
                    }
                });
            }
        } else if (levelCompleteTimer > 0) {
            levelCompleteTimer--;
            if (levelCompleteTimer % 15 === 0) {
                blinkState = !blinkState;
            }
            if (levelCompleteTimer === 0) {
                resetLevel();
                soundtrack.play().catch(error => console.log("Soundtrack play failed:", error));
            }
            const testButton = document.getElementById("testButton");
            if (testButton) document.body.removeChild(testButton);
        }
    } else if (gameOver && !highScoreScreen) {
        gameOverTimer--;
        if (gameOverTimer <= 0) {
            highScoreScreen = true;
            const testButton = document.getElementById("testButton");
            if (testButton) document.body.removeChild(testButton);
            createHighScoreInput();
        }
    } else {
        const testButton = document.getElementById("testButton");
        if (testButton) document.body.removeChild(testButton);
    }
    draw();
    requestAnimationFrame(update);
}

function createHighScoreInput() {
    const highScoreSection = document.createElement("div");
    highScoreSection.id = "highScoreInputSection";

    const enterNameText = document.createElement("div");
    enterNameText.textContent = "Enter your name:";
    highScoreSection.appendChild(enterNameText);

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 3;
    input.focus();
    highScoreSection.appendChild(input);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Score";
    highScoreSection.appendChild(submitButton);

    const playAgainButton = document.createElement("button");
    playAgainButton.textContent = "Play Again";
    highScoreSection.appendChild(playAgainButton);

    document.body.appendChild(highScoreSection);

    submitButton.addEventListener("click", () => {
        const name = input.value.trim() || "AAA";
        highScores.push({ name, score });
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 5);
        input.disabled = true;
        submitButton.disabled = true;
    });

    playAgainButton.addEventListener("click", () => {
        document.body.removeChild(highScoreSection);
        resetGame();
    });
}

const startScreen = document.createElement("div");
startScreen.id = "startScreen";
const startLogo = document.createElement("img");
startLogo.id = "startLogo";
startLogo.src = "src/pacmanlogo.png";
startLogo.alt = "Pac-Man Logo";
const startButton = document.createElement("button");
startButton.id = "startButton";
startButton.textContent = "Start Game";
startScreen.appendChild(startLogo);
startScreen.appendChild(startButton);
document.body.appendChild(startScreen);

startButton.addEventListener("click", () => {
    preloadAudio();
    resetGame();
    document.body.removeChild(startScreen);
    update();
});