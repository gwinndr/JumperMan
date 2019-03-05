/*
    Damon Gwinn
    The controls:
    - AD for movement left and right
    - SPACE for jumping
    - S for a downward force while in the air
    - Click to shoot a pellet (only one on screen at a time)
*/

var LeftRightForce;
var JumpForce;
var DownForce;
var ShootForce;

function keyDown(event)
{
    //console.log("In keyDown\n");
    var code = event.keyCode;
    if(code == 65) // a
    {
        MoveLeft(JumperManModel, LeftRightForce);
    }
    else if(code == 68) // d
    {
        MoveRight(JumperManModel, LeftRightForce);
    }
    else if(code == 83) // s
    {
        MoveDown(JumperManModel, DownForce);
    }
    else if(code == 87) // w
    {
        //Jump(JumperManModel, JumpForce);
    }
    else if(code == 32) // SPACE
    {
        Jump(JumperManModel, JumpForce);
    }
}

function keyUp(event)
{
    //console.log("In keyUp\n");
    var code = event.keyCode;
    if(code == 65) // a
    {
        StopLeft(JumperManModel, LeftRightForce);
    }
    else if(code == 68) // d
    {
        StopRight(JumperManModel, LeftRightForce);
    }
    else if(code == 83) // s
    {
        // Found this lead to unsmooth gameplay
        //StopDown(JumperManModel, DownForce);
    }
}

function canvasClicked(event)
{
    var canvasX = event.clientX;
    var canvasY = event.clientY;

    // Converting to clipspace coords
    xCoord = 2.0 * canvasX / VIEWPORT_WIDTH-1.0;
    yCoord = -(2.0 * canvasY / VIEWPORT_HEIGHT-1.0);

    //console.log(xCoord);
    //console.log(yCoord);

    ShootEvent(PelletModel, JumperManModel, ShootForce, xCoord, yCoord);
}
