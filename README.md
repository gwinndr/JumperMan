# JumperMan
JumperMan is a 2D game written entirely in WebGL for a computer graphics class. JumperMan features a custom physics engine that was painstakingly made in Javascript all for the pleasure of saying I wrote a physics engine in Javascript. But hey! I got an A on this so it was probably worth it...

Is JumperMan fun? Yeah it's pretty alright. I wouldn't pay money for it but it's a good "hey he can program" type gig so enjoy. Maybe I'll keep a high-score leaderboard and charge a quarter per entry like the good ole days.

# How to play
Simply open "JumperMan.html" in either Chrome or Firefox. If you don't use those, you honestly have bigger problems, but it might work in Edge, I don't know. You need WebGL to run this. Using a laptop trackpad is considered a handicap.

You move with the WASD keys and jump using the space bar. While in mid-air you can press the S key to apply a one-time downward force which helps with controlling your in-air movement so keep that in mind.

Using the mouse and clicking allows you to shoot at the hurling red spikes, forgot to mention those. If they touch you, you die and the screen turns red and bad stuff happens so don't let that happen! Shooting a spike twice causes it to be destroyed and it can't hurt you anymore. Only one pellet is allowed on the screen at any one time so don't miss!

You "win" when the timer hits 30 seconds. You can see the timer and score below the main game plane (say that 5 times fast). The score is just how many spikes you've eliminated.


## Difficulty
The game defaults on Easy because it's actually a bit hard until you get the hang of it. You can change the difficulty by opening "JumperMan.js" in Notepad and changing the "var DIFFICULTY" declaration at the top. I didn't feel like making a splash page. Hard is actually pretty tough so good luck!

### A note on framerate
Gravity is a time-based system so no worries there, but movement speed is not. The higher your framerate, the faster the game moves. So if you got that fancy new 165hz monitor, you're probably screwed. Will I fix it? Probably not...

# Mathematics
If you're curious about how various systems work mathematically, I'll describe it here.

The physics engine is based on force and velocity in the x and y. Force is added to velocity and velocity tracks how fast you were going in the previous frame. Gravitational acceleration is added at each frame. The exact force of that acceleration is based on a timer to keep gravity from getting too crazy at high fps.

Hitboxes are used to detect collisions. Hitboxes between rectangles are easy, simple check if a point is inside the rectangle by doing some greater-than less-than checks. Spikes use a triangular hitbox and so are a bit more complex. Basically, I treat the player's rectangle hitbox as four lines and the spike's triangle hitbox as three lines. Then I check if any of the player's hitbox lines intersect the spike's hitbox line. You can see this in action in Physics/Collision.js.

In order to keep the player from falling through the floor, I implemented a "snapping" mechanic. If downward velocity puts the player's lowest hitbox point below an environment object, the player is "snapped" to the object. This basically means, the players lower y-value is set to very slightly above the object's y-value. If the player's lowest hitbox point was already below the environment object, then nothing happens (basically Smash Bros. collision).

Shooting is done by projecting a vector out from the player to the clicked position. The vector is normalized and multiplied by the shooting force and collision is checked between it and the spikes. The pellets have a square hitbox and so collision is checked similar using the line intersection method I described earlier.

Jumping applies a one-time force in the positive y-direction and using the S key while in mid-air applies a one-time force in the negative y-direction. Having the downward force makes the controls feel much more fluid.

The different spikes come into the scene at random times with a 50-50 shot of coming from the left or right. Each spike has a fixed y-coordinate (testing showed this worked better than randomized). They move with a constant magnitude. The higher the difficulty, the more spikes are appearing.



