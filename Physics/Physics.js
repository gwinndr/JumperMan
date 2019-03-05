/*
    Damon Gwinn
    The physics engine
    For initialization and computing a translation based on basic physics
*/

// Initializes a model to use the physics engine
function InitPhysics(model, viewportWidth, viewportHeight)
{
    if(model.Type == "JumperMan")
    {
        model.Physics = {
            xy_force: [.0, .0],
            xy_velocity: [.0, .0],
            t: -1, // Time
            pixelWidth: viewportWidth,
            pixelHeight: viewportHeight,

            leftEvent: false,
            rightEvent: false,
            jumpEvent: false,
            downEvent: false,

            leftForce: 0.0,
            rightForce: 0.0,
            jumpForce: 0.0,
            downForce: 0.0,

            snappedToGround: false
        };
    }

    else if(model.Type == "Pellet")
    {
        model.Physics = {
            xy_force: [.0, .0],
            xy_velocity: [.0, .0],
            t: -1, // Time
            pixelWidth: viewportWidth,
            pixelHeight: viewportHeight,

            onScreen: false
        };
    }

    else if(model.Type == "Spike")
    {
        model.Physics = {
            xy_force: [.0, .0],
            xy_velocity: [.0, .0],
            t: -1, // Time
            pixelWidth: viewportWidth,
            pixelHeight: viewportHeight,

            crossedScreen: true
        };
    }

}

// Sets the transX and transY of a model based on physics
// snapObjects define objects to snap to if moving downward places the bottom two vertices
//  of the hitbox below the object (only applicable to JumperManModel)
function SetPhysicsTrans(model, snapObjects)
{
    // Adding one-time forces
    model.Physics.xy_velocity[0] += model.Physics.xy_force[0];
    model.Physics.xy_velocity[1] += model.Physics.xy_force[1];

    if(model.Type == "JumperMan")
    {
        SetJumperManPhysics(model, snapObjects);
    }
    else if(model.Type == "Pellet")
    {
        SetPelletPhysics(model);
    }
    else if(model.Type == "Spike")
    {
        SetSpikePhysics(model);
    }

    // Resetting one-time forces
    model.Physics.xy_force[0] = 0.0;
    model.Physics.xy_force[1] = 0.0;
}


function placeholder(model, snapObjects)
{
    // Applying user forces
    model.Physics.xy_velocity[0] += model.Physics.xy_force[0];
    model.Physics.xy_velocity[1] += model.Physics.xy_force[1];

    var before_transX = model.TransX;
    var before_transY = model.TransY;
    model.TransX += model.Physics.xy_velocity[0];
    model.TransY += model.Physics.xy_velocity[1];

    var moved_hitbox_after = GetMovedHitbox(model, model.TransX, model.TransY, model.Rotation);

    // This initialized implies that we want it not rendered if off the screen
    if(model.Physics.onScreen == true)
    {
        OffScreen(model, moved_hitbox_after);
        return;
    }
    else
        //MoveBackIfOutsideBoundary(model, moved_hitbox_after);

    // Will snap to our snapObjects if gravity intersects
    if(model.Physics.xy_velocity[1] < 0.0 && snapObjects.length > 0)
    {
        var moved_hitbox_before = GetMovedHitbox(model, before_transX, before_transY, model.Rotation);
        for(var i = 0; i < snapObjects.length; ++i)
        {
            var obj = snapObjects[i];
            var obj_moved_hitbox = GetMovedHitbox(obj, obj.TransX, obj.TransY, obj.Rotation);
            if(ShouldSnap(moved_hitbox_before, moved_hitbox_after, obj_moved_hitbox))
            {
                model.TransY = obj_moved_hitbox[0][1] - model.Hitbox[1][1];
                model.Physics.xy_velocity[1] = 0.0;
                model.Physics.xy_force[1] = 0.0;
                model.Physics.snappedToGround = true;
                model.Physics.jumpEvent = false;
                model.Physics.downEvent = false;
                model.Physics.snapObjHitbox = obj_moved_hitbox;
                break;
            }
            else
            {
                model.Physics.snappedToGround = false;
            }
        }
    }


    model.Physics.xy_velocity[0] -= model.Physics.xy_force[0];
    model.Physics.xy_velocity[1] -= model.Physics.xy_force[1];
    model.Physics.xy_force[0] = 0.0;
    model.Physics.xy_force[1] = 0.0;
}

// Physics for the JumperManModel
// Will use gravity and snap objects to simulate movement
function SetJumperManPhysics(model, snapObjects)
{
    var before_transX = model.TransX;
    var before_transY = model.TransY;
    model.TransX += model.Physics.xy_velocity[0];
    model.TransY += model.Physics.xy_velocity[1];

    var moved_hitbox_after = GetMovedHitbox(model, model.TransX, model.TransY, model.Rotation);
    MoveBackIfOutsideBoundary(model, moved_hitbox_after);

    // Will snap to our snapObjects if gravity intersects
    if(model.Physics.xy_velocity[1] < 0.0 && snapObjects.length > 0)
    {
        var moved_hitbox_before = GetMovedHitbox(model, before_transX, before_transY, model.Rotation);
        for(var i = 0; i < snapObjects.length; ++i)
        {
            var obj = snapObjects[i];
            var obj_moved_hitbox = GetMovedHitbox(obj, obj.TransX, obj.TransY, obj.Rotation);
            if(ShouldSnap(moved_hitbox_before, moved_hitbox_after, obj_moved_hitbox))
            {
                model.TransY = obj_moved_hitbox[0][1] - model.Hitbox[1][1];
                model.Physics.xy_velocity[1] = 0.0;
                model.Physics.xy_force[1] = 0.0;
                model.Physics.snappedToGround = true;
                model.Physics.jumpEvent = false;
                model.Physics.downEvent = false;
                model.Physics.snapObjHitbox = obj_moved_hitbox;
                break;
            }
            else
            {
                model.Physics.snappedToGround = false;
            }
        }
    }
}

// Physics for the pellet model
// Moves in a static line, disappears if off screen
function SetPelletPhysics(model)
{
    var before_transX = model.TransX;
    var before_transY = model.TransY;
    model.TransX += model.Physics.xy_velocity[0];
    model.TransY += model.Physics.xy_velocity[1];

    var moved_hitbox_after = GetMovedHitbox(model, model.TransX, model.TransY, model.Rotation);

    // Sets the onScreen boolean if it detects the pellet went off the screen
    OffScreen(model, moved_hitbox_after);
}

// Physics for the spike model
// Moves in a static line, disappears after travelling the length of the screen
function SetSpikePhysics(model)
{
    var before_transX = model.TransX;
    var before_transY = model.TransY;
    model.TransX += model.Physics.xy_velocity[0];
    model.TransY += model.Physics.xy_velocity[1];

    var moved_hitbox_after = GetMovedHitbox(model, model.TransX, model.TransY, model.Rotation);

    // Sets the onScreen boolean if it detects the pellet went off the screen
    if(CrossedScreen(model))
    {
        model.Physics.crossedScreen = true;
    }
}

// Helper for SetPhysicsTrans.
// Says if an object should be snapped to
function ShouldSnap(hitbox_before, hitbox_after, hitbox_obj)
{
    var upper_before = hitbox_before[0];
    var bottom_before = hitbox_before[1];

    var upper_after = hitbox_after[0];
    var bottom_after = hitbox_after[1];

    var upper_obj = hitbox_obj[0];
    var bottom_obj = hitbox_obj[1];

    var eq_thres = 0.0001;
    var y_eq1 = Math.abs(bottom_before[1] - upper_obj[1]) <= 0.0001;
    var y_eq2 = Math.abs(bottom_after[1] - upper_obj[1]) <= 0.0001;

    // First determine if original y is above
    if((bottom_before[1] > upper_obj[1] || y_eq1) && (bottom_after[1] < upper_obj[1] || y_eq2))
    {
        // Then ensure that the x's line up
        if(upper_after[0] <= bottom_obj[0] && bottom_after[0] >= upper_obj[0])
        {
            return true;
        }
    }

    return false;
}

function MoveBackIfOutsideBoundary(model, movedHitbox)
{
    if(movedHitbox[0][0] < -1.0)
    {
        model.TransX = -0.999 - model.Hitbox[0][0];
    }
    else if(movedHitbox[1][0] > 1.0)
    {
        model.TransX = 0.999 - model.Hitbox[1][0];
    }
}

function OffScreen(model, movedHitbox)
{
    if(movedHitbox[0][0] < -1.0)
    {
        model.Physics.onScreen  = false;
    }
    else if(movedHitbox[1][0] > 1.0)
    {
        model.Physics.onScreen  = false;
    }
    else if(movedHitbox[1][1] < -1.0)
    {
        model.Physics.onScreen  = false;
    }
    else if(movedHitbox[0][1] > 1.0)
    {
        model.Physics.onScreen  = false;
    }
}

function CrossedScreen(model)
{
    return(
        // Moving left
        ( model.Physics.xy_velocity[0] < 0.0 && model.TransX <= -1.0 )
        ||
        // Moving right
        ( model.Physics.xy_velocity[0] >= 0.0 && model.TransX >= 1.0 )
    );
}

// Will get a random spike moving left/right above a given environment object
function getRandomSpikeMovement(model, maxBelow, maxAbove, velocity)
{
    var direction =  Math.floor(Math.random() * 2);
    if(direction == 0)
    {
        model.TransX = 1.0;
        model.Rotation = -Math.PI/2;
        model.Physics.xy_velocity[0] = -velocity;
    }
    else
    {
        model.TransX = -1.0;
        model.Rotation = Math.PI/2;
        model.Physics.xy_velocity[0] = velocity;
    }

    // If the random number gives a number greater than 1.0, negate it
    // Valid range determined by highest y_value of given environment object
    var valid_range = Math.round( (maxAbove - maxBelow) * 100 );
    var pos = (Math.random() * valid_range) / 100;
    if(pos > maxAbove)
    {
        pos = (-1) * (pos - maxAbove);
    }

    model.TransY = pos;
    model.Physics.crossedScreen = false;
}
