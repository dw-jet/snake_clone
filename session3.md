## Session 3
In this session the main focus was on cleaning up the code that had been written, and including a score. I realized early on I was going overboard with the design so I started over. Instead I thought I'd just lump code into javascript objects and reduce coupling between these new objects.

I started by creating an object for snake, food, and the game. Snake and food don't really need to know about each other so one shouldn't directly call into the other. The game will instead use these two objects and call their functions to run the game.

The two real pain points where the game loop and the update function on the snake. I had to seperate the logic of updating the snake with a food collision and without into two methods so that snake didn't need to know about food. I moved the code that needed to know about food to game. The gameLoop picked up the slack of running conditional code and looping until it found a location the snake didn't exist in to place the food.

I also added a simple scoring system to the game with each growth being worth 5 points. I wanted to add the score to localStorage as a high score if it was > what was already in localStorage, but I ran out of time for today.

That concludes this little exercise. I might come back and touch this code again eventually. Maybe I'll add some controls to restart the game, adjust the speed, and implement that high score. I don't expect that time to be soon though.

Thanks for reading!