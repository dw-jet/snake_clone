//TODO grow snake
//TODO collision detection

let cvs = document.getElementById("snake-game");
let ctx = cvs.getContext("2d");
// Deconstruct width and height properties of the canvas
const { width: w, height: h } = cvs;
// Start the snake near the top left corner of our 375x300 area.
ctx.fillStyle = "#000";
let startx = 1;
let starty = 1;
let segment = 15;

let snake = [];
let start_len = 4;
let direction = "right";
let gameOver = false;
let food_loc = { x: -1, y: -1 };

document.onkeydown = function (event) {
    // Stop the browser from scrolling
    event.preventDefault();
    keyCode = event.keyCode;

    switch (keyCode) {

        case 37:
            if (direction != 'right') {
                direction = 'left';
            }
            break;

        case 39:
            if (direction != 'left') {
                direction = 'right';
            }
            break;

        case 38:
            if (direction != 'down') {
                direction = 'up';
            }
            break;

        case 40:
            if (direction != 'up') {
                direction = 'down';
            }
            break;
    }
}

function clear() {
    ctx.clearRect(0, 0, w, h);
}

// We keep track of a single point to make the math easy but multiply by side of a segment when drawing
// Basically that makes this a grid of 15x15 squares. 25 squares wide by 20 squares tall.
function drawSnake() {
    for (i = 0; i < snake.length; i++) {
        segmentCoords = snake[i]
        ctx.fillRect(segmentCoords.x * segment, segmentCoords.y * segment, segment, segment);
    }
}
function setupSnake() {
    for (let i = start_len; i > 0; i--) {
        snake.push({ x: startx * i, y: starty });
    }
}

function detectCollision(gameElement, i = 0) {
    for (i; i < snake.length; i++) {
        if (gameElement.x === snake[i].x && gameElement.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function spawnFood() {
    if (food_loc.x === -1) {
        // Between 0-24x and 0-19y
        food_x = Math.floor(Math.random() * 25);
        food_y = Math.floor(Math.random() * 20);
        food_loc = { x: food_x, y: food_y };
    }
}

function drawFood() {
    ctx.fillRect(food_loc.x * segment, food_loc.y * segment, segment, segment);
}

function checkFoodCollision() {
    if (snake[0].x === food_loc.x && snake[0].y === food_loc.y) {
        return true;
    }
}

function checkSnakeCollision() {
    if (detectCollision(snake[0], 1)) {
        gameOver = true;
    }
    snake.unshift()
}

function checkCollisions() {
    
}
// The movement works by popping the tail off incrementing the position from the head
// and then putting the tail with it's new position back at the beginning of the array.
// If we're off the screen on the x-axis then pop out the other side.
function updateSnake() {
    if (!checkFoodCollision()) {
        let tail = snake.pop();
        switch (direction) {
            case "right":
                tail.x = snake[0].x + 1;
                tail.y = snake[0].y;
                if (tail.x * segment >= w) {
                    tail.x = w / segment - tail.x;
                }
                break;
            case "down":
                tail.y = snake[0].y + 1;
                tail.x = snake[0].x;
                if (tail.y * segment >= h) {
                    tail.y = h / segment - tail.y;
                }
                break;
            case "left":
                tail.x = snake[0].x - 1;
                tail.y = snake[0].y;
                if (tail.x * segment < 0) {
                    tail.x = w / segment + tail.x;
                }
                break;
            case "up":
                tail.y = snake[0].y - 1;
                tail.x = snake[0].x;
                if (tail.y * segment < 0) {
                    tail.y = h / segment + tail.y;
                }
                break;
        }
        snake.unshift(tail);
        checkSnakeCollision();
    }
    else {
        snake.unshift(food_loc);
        food_loc = { x: -1, y: -1 };
    }
}
// This is our function which starts the animation and recursively updates
// The function needs to take a timestamp that is passed in from requestAnimation frame.
// We'll use this later to set delta time to smooth the framerate.
// 60 fps is really fast so we're going to slow it down to 20.
let fps = 15;
let current_time;
let last_time = Date.now();
let interval = 1000 / fps;
let delta_time;
function gameLoop(t) {
    requestAnimationFrame(gameLoop);
    current_time = Date.now();
    delta_time = current_time - last_time;

    if (delta_time > interval) {
        clear();
        if (!gameOver) {
            spawnFood();
            updateSnake();
            drawFood(food_loc);
            drawSnake();
            // I found this nice little bit online
            // Eventually the framerate drops because
            // of the fractional differences so we have
            // to subract them to keep it running correctly
            last_time = current_time - (delta_time % interval);
        } else {
            ctx.font = "30px Arial";
            ctx.fillText("Game Over", 105, h/2) 
        }
    }
}
// The inital draw
setupSnake();
drawSnake();
requestAnimationFrame(gameLoop);
