## Session 2 Summary
So I was just reviewing my code I noticed a few things. For some reason I put clear in the draw snake function
instead of the game loop. That needed to be fixed. I also forgot to mention in my last post how I'm handling 
the canvas as a grid. It is in the comments, but not in the write-up. I sized the canvas to 375x300 because 
both are evenly divisible by 15. This lets me use a simple incrementer to move the snake 
and then multiply that by 15 when I draw. That basically creates a grid like structure of 15x15 squares with 25 
squares horizontally and 20 squares vertically.

Now with that out of the way I need to work on spawning food. The food should spawn in a random location.
The food should not spawn in a location the snake already is. I can see the need for a generic collision detector for the snakes location before I can go much further. It's needed to eat food and check for game over.

The next thing is growing the snake when it eats. The best solution I can think of is manipulating the snake array when 
the snake collides with the food. Maybe the food should just basically become part of the snake. Instead of moving 
the tail to the head we could just make the food the new head when they collide. This kind of interrupts the normal flow of the animation in a way I don't like, but given my constraints it'll have to do.

I've thought a bit about how to handle the collision detection since last time and I think I'm going with the simplest 
way I can think of which is to scan the coords of each element of the snake array and compare it to the coords of the new 
head when updating. When doing this I realized that because of the way I was popping the food onto the head it was detecting a game over collision every time we hit food. I handled this by only checking for snake collisions if there wasn't a food collision.  With all that in place we have a functioning snake game! 

All things considered this was quite the learning experience. I knew some of the high level concepts of game development, but I never really gave much thought about how to implement them myself. 
I was also reminded that it's kind of crazy what you can accomplish on a strict timeline. The code isn't pretty by any stretch of the imagination, but it functions. 

When I have some more time I'll take a 3rd session to clean up and structure the code better and make another pass for any bugs. I'm sure there are plenty since it's late and I'm about to fall asleep at my keyboard as I'm finishing this. 

Since the code is in it's finished state just check the snake.js file to see the progress this time. When I come back for the third session I might post it here.