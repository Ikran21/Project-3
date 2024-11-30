const GRID_SIZE = 4; // Size of the puzzle grid (4x4)
const TILE_SIZE = 100; // Size of each tile in pixels

let tiles = [];
let blankTile = { x: 3, y: 3 }; // Initial position of the blank tile
let moveCount = 0;
let startTime;
let timerInterval;

const backgrounds = [
    'url("background.jpg")',
    'url("toad.jpg")',
    'url("luigi.jpg")',
    'url("bowser.jpg")'
];  // Array of different background images

let currentBackground = 0; // Default background index

document.addEventListener("DOMContentLoaded", () => {
    const puzzleContainer = document.getElementById("puzzle-container");
    const shuffleButton = document.getElementById("shuffle-button");
    const backgroundSelect = document.getElementById("background-select");

    initializePuzzle(puzzleContainer);
    resetGameStats();

    shuffleButton.addEventListener("click", () => {
        shufflePuzzle();
        resetGameStats();
    });

    // Event listener to change background
    backgroundSelect.addEventListener("change", (e) => {
        currentBackground = parseInt(e.target.value);
        applyBackground();
    });
});

function initializePuzzle(container) {
    // Clear existing tiles
    container.innerHTML = '';
    tiles = [];

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (i === 3 && j === 3) continue; // Skip the blank space

            const tile = document.createElement("div");
            tile.classList.add("tile");

            // Add number span on top of the background
            const numberSpan = document.createElement("span");
            numberSpan.classList.add("tile-number");
            numberSpan.textContent = i * GRID_SIZE + j + 1;
            tile.appendChild(numberSpan);

            // Set the background position for this tile
            tile.style.backgroundPosition = `-${j * TILE_SIZE}px -${i * TILE_SIZE}px`;

            // Set initial grid position
            tile.style.gridRow = `${i + 1}`;
            tile.style.gridColumn = `${j + 1}`;

            tile.dataset.x = j;
            tile.dataset.y = i;
            tile.dataset.value = i * GRID_SIZE + j + 1;

            tile.addEventListener("click", () => moveTile(tile));
            tile.addEventListener("mouseover", () => highlightMovable(tile));
            tile.addEventListener("mouseout", () => removeHighlight(tile));

            container.appendChild(tile);
            tiles.push(tile);
        }
    }

    applyBackground();  // Apply the initial background
}

function applyBackground() {
    // Set the background image for each tile based on the selected background
    tiles.forEach(tile => {
        tile.style.backgroundImage = backgrounds[currentBackground];
    });
}

function moveTile(tile) {
    const x = parseInt(tile.dataset.x);
    const y = parseInt(tile.dataset.y);

    if (isMovable(x, y)) {
        // Update grid position
        tile.style.gridRow = `${blankTile.y + 1}`;
        tile.style.gridColumn = `${blankTile.x + 1}`;

        // Update dataset position
        tile.dataset.x = blankTile.x;
        tile.dataset.y = blankTile.y;

        // Update blank tile position
        blankTile.x = x;
        blankTile.y = y;

        moveCount++;
        updateGameStats();
        checkWinCondition();
    }
}

function highlightMovable(tile) {
    const x = parseInt(tile.dataset.x);
    const y = parseInt(tile.dataset.y);

    if (isMovable(x, y)) {
        tile.classList.add("movablepiece");
    }
}

function removeHighlight(tile) {
    tile.classList.remove("movablepiece");
}

function isMovable(x, y) {
    return (
        (Math.abs(x - blankTile.x) === 1 && y === blankTile.y) ||
        (Math.abs(y - blankTile.y) === 1 && x === blankTile.x)
    );
}

function shufflePuzzle() {
    // Perform many random valid moves
    for (let i = 0; i < 200; i++) {
        const movableTiles = getMovableNeighbors();
        const randomTile = movableTiles[Math.floor(Math.random() * movableTiles.length)];
        moveTile(randomTile);
    }
    
    // Reset game state after shuffle
    moveCount = 0;
    updateGameStats();
}

function getMovableNeighbors() {
    return tiles.filter(tile => {
        const x = parseInt(tile.dataset.x);
        const y = parseInt(tile.dataset.y);
        return isMovable(x, y);
    });
}

function checkWinCondition() {
    // First check if blank tile is in the correct position (bottom right)
    if (blankTile.x !== 3 || blankTile.y !== 3) {
        return false;
    }

    // Then check if all other tiles are in correct positions
    const isWon = tiles.every(tile => {
        const value = parseInt(tile.dataset.value);
        const x = parseInt(tile.dataset.x);
        const y = parseInt(tile.dataset.y);
        
        // Calculate where this number should be
        const correctX = (value - 1) % GRID_SIZE;
        const correctY = Math.floor((value - 1) / GRID_SIZE);
        
        return x === correctX && y === correctY;
    });

    if (isWon) {
        clearInterval(timerInterval);
        document.getElementById("puzzle-container").style.border = "5px solid gold";
        alert(`Congratulations! You solved the puzzle in ${moveCount} moves!`);
    }
}

function updateGameStats() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("game-stats").textContent = 
        `Moves: ${moveCount}, Time: ${elapsedTime}s`;
}

function resetGameStats() {
    moveCount = 0;
    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateGameStats, 1000);
    updateGameStats();
}
