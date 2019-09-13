/*
    Damon Gwinn
    For moving and jumping with specified force
    NOTE: There is no friction
*/

function InitOnScreen(model, viewportWidth, viewportHeight)
{
    InitPhysics(model, viewportWidth, viewportHeight);
    model.Physics.onScreen = false;
}

function Jump(model, force)
{
    if(model.Physics.jumpEvent == false && model.Physics.snappedToGround == true)
    {
        model.Physics.jumpEvent = true;
        model.Physics.jumpForce = force;
        model.Physics.xy_force[1] += force;
    }
}

function MoveDown(model, force)
{
    if(model.Physics.downEvent == false)
    {
        model.Physics.downEvent = true;
        model.Physics.downForce = force;
        model.Physics.xy_velocity[1] -= force;
    }
}

function MoveLeft(model, force)
{
    if(model.Physics.leftEvent == false)
    {
        model.Physics.leftEvent = true;
        model.Physics.leftForce = force;
        model.Physics.xy_velocity[0] -= force;
    }
}

function MoveRight(model, force)
{
    if(model.Physics.rightEvent == false)
    {
        model.Physics.rightEvent = true;
        model.Physics.rightForce = force;
        model.Physics.xy_velocity[0] += force;
    }
}

function StopLeft(model)
{
    if(model.Physics.leftEvent == true)
    {
        model.Physics.leftEvent = false;
        model.Physics.xy_velocity[0] += model.Physics.leftForce;
    }
}

function StopRight(model)
{
    if(model.Physics.rightEvent == true)
    {
        model.Physics.rightEvent = false;
        model.Physics.xy_velocity[0] -= model.Physics.rightForce;
    }
}

function StopDown(model)
{
    // Collision will handle the falling stop
    if(model.Physics.downEvent == true)
    {
        model.Physics.downEvent = false;
    }
}
