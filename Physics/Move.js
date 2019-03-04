/*
    Damon Gwinn
    For moving and jumping with specified force
    NOTE: There is no friction
*/

function Jump(model, force)
{
    model.Physics.jumpEvent = true;
    model.Physics.jumpForce = force;
}

function MoveDown(model, force)
{
    model.Physics.downEvent = true;
    model.Physics.downForce = force;
}

function MoveLeft(model, force)
{
    model.Physics.leftEvent = true;
    model.Physics.leftForce = force;
}

function MoveRight(model, force)
{
    model.Physics.rightEvent = true;
    model.Physics.rightForce = force;
}

function StopLeft(model)
{
    model.Physics.leftEvent = false;
}

function StopRight(model)
{
    model.Physics.rightEvent = false;
}

function StopDown(model)
{
    model.Physics.downEvent = false;
}
