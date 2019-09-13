/*
    Damon Gwinn
    Sets the time variable. Should be set when starting things like a gravity event
*/

function SetTime(model, t)
{
    model.Physics.t = t;
}

function GetSecondsSinceEpoch()
{
    return (new Date() / 1000);
}
