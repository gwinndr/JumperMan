/*
    Damon Gwinn
    A very simple, tweakable gravity engine
*/

// Should be called whenever you want gravity to begin
// WARNING: Overwrites time variable on model
function StartGravityEvent(model)
{
    SetTime(model, GetSecondsSinceEpoch());
}

// Should be called on each frame the gravity event is in play
// snapObjects refers to objects that should be snapped to if gravity intersects us with it
// WARNING: Overwrites time variable
function AddGravity(model, gravAccel)
{
    var new_t = GetSecondsSinceEpoch();
    var force = (new_t - model.Physics.t) * gravAccel;
    model.Physics.t = new_t;
    model.Physics.xy_velocity[1] -= force/model.Physics.pixelHeight;
}
