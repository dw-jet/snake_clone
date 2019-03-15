## Session 1 Summary
The first thing to do is set up the canvas and draw the snake. The snake in the game grows and the head moves independently so I will need an array of indepently drawn squares. That also means the usual way of moving an object by incrementing it's coords won't work.

I didn't want to waste too much time on it due to my time constraint so I went out and looked it up and the answer was really obvious in hindsight; move the last block of the snake to the head using the x/y coods of the current head and the direction. 

In order to control direction I need to event handlers for the arrow keys, and I need to prevent them from scrolling the page. I know from what little game development I've done that I'm going to need to wrap some things up in a function. 

We need to clear the canvas, update the coordinates, and draw in a loop to animate the game. The problem I ran into was that the loop ran way too fast to be playable. I found a nice solution online to control the fps of requestAnimationFrame online that didn't rely on a timeout.

That's all the time I had for this session. Next time I'll have to look at getting some collision detection going, spawning food in random locations, and growing the snake when it eats.

```javascript
let cvs = document.getElementById("snake-game");
let ctx = cvs.getContext("2d");
// Deconstruct width and height properties of the canvas
const { width: w, height: h } = cvs;
// Start the snake near the top left corner of our 375x300 area.
ctx.fillStyle = "#000";
let startx = 1;
let starty = 1;
let segment= 15;

let snake = [];
let start_len = 4;
let direction = "right";

document.onkeydown = function (event) {
    // Stop the browser from scrolling
        event.preventDefault();
        keyCode = event.keyCode;

        switch (keyCode) {

        case 37:
            if (direction != 'right') {
                direction = 'left';
            }
            console.log('left');
            break;

        case 39:
            if (direction != 'left') {
                direction = 'right';
                console.log('right');
            }
            break;

        case 38:
            if (direction != 'down') {
                direction = 'up';
                console.log('up');
            }
            break;

        case 40:
            if (direction != 'up') {
                direction = 'down';
                console.log('down');
            }
            break;
        }
}

function clear() {
    ctx.clearRect(0,0,w,h);
}

// We keep track of a single point to make the math easy but multiply by side of a segment when drawing
// Basically that makes this a grid of 15x15 squares. 25 squares wide by 20 squares tall.
function drawSnake() {
    clear();
    for (i=0; i<snake.length; i++){
        segmentCoords = snake[i]
        ctx.fillRect(segmentCoords.x * segment, segmentCoords.y * segment, segment, segment);
    }
}
function setupSnake() {
    for (let i=start_len; i>0; i--){
        snake.push({x: startx * i, y: starty});
    }
}

// The movement works by popping the tail off incrementing the position from the head
// and then putting the tail with it's new position back at the beginning of the array.
// If we're off the screen on the x-axis then pop out the other side.
function updateSnake() {
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
            tail.x=snake[0].x;
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
}
// This is our function which starts the animation and recursively updates
// The function needs to take a timestamp that is passed in from requestAnimation frame.
// 60 fps is really fast so we're going to slow it down to 20.
let fps = 20;
let current_time;
let last_time = Date.now();
let interval = 1000/fps;
let delta_time;
function gameLoop() {
    requestAnimationFrame(gameLoop);
    current_time = Date.now();
    delta_time = current_time - last_time;

    if (delta_time > interval) {
        updateSnake();
        drawSnake();
        // I found this nice little bit online
        // Eventually the framerate drops because
        // of the fractional differences so we have
        // to subract them to keep it running correctly
        last_time = current_time - (delta_time % interval);
    }
}
// The inital draw
setupSnake();
drawSnake();

requestAnimationFrame(gameLoop);

```

