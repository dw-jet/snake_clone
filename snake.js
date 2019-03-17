// Setup canvas and secure a context to draw
let cvs = document.getElementById("snake-game");
let ctx = cvs.getContext("2d");
let w = cvs.width;
let h = cvs.height;
ctx.fillStyle = "#000";
// fps being inside game and being used in a calculation broke the game_loop
// so let's just move it out here
let fps = 15;

let snake = {
    // Start the snake near the top left corner of our 375x300 area.
    start_x: 1,
    start_y: 1,
    segment: 15,
    snake_positions: [],
    start_len: 4,
    direction: "right",
    
    // We keep track of a single point to make the math easy but multiply by side of a segment when drawing
    // Basically that makes this a grid of 15x15 squares. 25 squares wide by 20 squares tall.
    draw: function() {
        for (i = 0; i < snake.snake_positions.length; i++) {
            segment_coords = snake.snake_positions[i]
            ctx.fillRect(segment_coords.x * snake.segment, segment_coords.y * snake.segment, snake.segment, snake.segment);
        }
    },
    setup: function() {
        for (let i = snake.start_len; i > 0; i--) {
            snake.snake_positions.push({ x: snake.start_x * i, y: snake.start_y });
        }
    },
    // Split up update into two functions so it doesn't need to know about food that can be
    // handled by the game object.
    update_no_food: function() {
    // The movement works by popping the tail off incrementing the position from the head
    // and then putting the tail with it's new position back at the beginning of the array.
    // If we're off the screen on the x-axis then pop out the other side.
        let tail = snake.snake_positions.pop();
            switch (snake.direction) {
                case "right":
                    tail.x = snake.snake_positions[0].x + 1;
                    tail.y = snake.snake_positions[0].y;
                    if (tail.x * snake.segment >= w) {
                        tail.x = w / snake.segment - tail.x;
                    }
                    break;
                case "down":
                    tail.y = snake.snake_positions[0].y + 1;
                    tail.x = snake.snake_positions[0].x;
                    if (tail.y * snake.segment >= h) {
                        tail.y = h / snake.segment - tail.y;
                    }
                    break;
                case "left":
                    tail.x = snake.snake_positions[0].x - 1;
                    tail.y = snake.snake_positions[0].y;
                    if (tail.x * snake.segment < 0) {
                        tail.x = w / snake.segment + tail.x;
                    }
                    break;
                case "up":
                    tail.y = snake.snake_positions[0].y - 1;
                    tail.x = snake.snake_positions[0].x;
                    if (tail.y * snake.segment < 0) {
                        tail.y = h / snake.segment + tail.y;
                    }
                    break;
            }
            snake.snake_positions.unshift(tail);
    },
    update_with_food: function(food_loc){
        snake.snake_positions.unshift(food_loc);
        // reset the food location since it's been absorbed
        return { x: -1, y: -1 };
    }
};

let food = {
    food_loc: { x: -1, y: -1 },
    segment: 15,

    spawn: function(snake_pos) {
        // Between 0-24x and 0-19y
        let food_x = Math.floor(Math.random() * 25);
        let food_y = Math.floor(Math.random() * 20);
        food.food_loc = { x: food_x, y: food_y };
    },

    draw: function() {
        ctx.fillRect(food.food_loc.x * food.segment, food.food_loc.y * food.segment, food.segment, food.segment);
    }   
};

let game = {
    segment: 15,
    game_over: false,
    current_time: undefined,
    last_time: Date.now(),
    interval: 1000 / fps,
    delta_time: undefined,
    score: 0,
    setup_keyboard: function() {
        document.onkeydown = function (event) {
            // Stop the browser from scrolling
            event.preventDefault();
            keyCode = event.keyCode;
        
            switch (keyCode) {
        
                case 37:
                    if (snake.direction != 'right') {
                        snake.direction = 'left';
                    }
                    break;
        
                case 39:
                    if (snake.direction != 'left') {
                        snake.direction = 'right';
                    }
                    break;
        
                case 38:
                    if (snake.direction != 'down') {
                        snake.direction = 'up';
                    }
                    break;
        
                case 40:
                    if (snake.direction != 'up') {
                        snake.direction = 'down';
                    }
                    break;
            }
        }
    },
    clear: function() {
        ctx.clearRect(0, 0, w, h);
    },
    // By optionally passing in the starting number we can skip the head if we need to
    detect_collision: function(game_element, i = 0) {
        for (i; i < snake.snake_positions.length; i++) {
            if (game_element.x === snake.snake_positions[i].x && game_element.y === snake.snake_positions[i].y) {
                return true;
            }
        }
        return false;
    },
    check_snake_collision: function() {
        // Skip the head on the check
        if (game.detect_collision(snake.snake_positions[0], 1)) {
            game.game_over = true;
        }
    },
    check_food_collision: function() {
        if (game.detect_collision(food.food_loc)) {
            return true;
        }
    },
    print_score: function() {
        ctx.font = "10px Arial";
        ctx.fillText(`Score: ${game.score}`, 320, 295);
    },
    // This is our function which starts the animation and recursively updates
    // 60 fps is really fast so we're going to slow it down to 15.
    gameLoop: function(t) {
        requestAnimationFrame(function(t){game.gameLoop(t)});
        game.current_time = Date.now();
        game.delta_time = game.current_time - game.last_time;

        if (game.delta_time > game.interval) {
            game.clear();
            if (!game.game_over) {
                if (!game.check_food_collision()) {
                    // This will spawn food at the start of the game
                    if (food.food_loc.x === -1) food.spawn();
                    snake.update_no_food();
                    game.check_snake_collision();
                } else {
                    game.score += 5;
                    food.food_loc = snake.update_with_food(food.food_loc);
                    // If food was eaten spawn new food until it doesn't 
                    // collide with the snake
                    do {
                        food.spawn();
                    } while (game.check_food_collision())
                }
                food.draw();
                snake.draw();
                game.print_score();
                // I found this nice little bit online
                // Eventually the framerate drops because
                // of the fractional differences so we have
                // to subract them to keep it running correctly
                game.last_time = game.current_time - (game.delta_time % game.interval);
            } else {
                ctx.font = "30px Arial";
                ctx.fillText("Game Over", 105, h/2);
                ctx.fillText(`Score: ${game.score}`, 110, h/2 + 35); 
            }
        }
    }
}

// The inital draw
game.setup_keyboard();
snake.setup();
snake.draw();
requestAnimationFrame(game.gameLoop);