/*
    Damon Gwinn
    Physics for shooting a pellet
    NOTE: Only one pellet on screen at a time
*/

function ShootEvent(model, modelFrom, force, coordX, coordY)
{
    if(model.Physics.onScreen == false)
    {
        model.Physics.onScreen = true;

        var startX = (modelFrom.Hitbox[1][0] + modelFrom.Hitbox[0][0]) / 2.0 + modelFrom.TransX;
        var startY = (modelFrom.Hitbox[0][1] + modelFrom.Hitbox[1][1]) / 2.0 + modelFrom.TransY;

        model.TransX = startX;
        model.TransY = startY;

        var slope_normalized = normalize(vec2(coordX - startX, coordY - startY));

        model.Physics.xy_velocity[0] = force * slope_normalized[0];
        model.Physics.xy_velocity[1] = force * slope_normalized[1];
    }

}
