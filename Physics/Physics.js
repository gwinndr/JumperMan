/*
    Damon Gwinn
    The physics engine
    For initialization and computing a translation based on basic physics
*/

// Initializes a model to use the physics engine
function InitPhysics(model, viewportWidth, viewportHeight)
{
    model.Physics = {
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

// Sets the transX and transY of a model based on physics
// snapObjects define objects to snap to if moving downward places the bottom two vertices
//  of the hitbox below the object
function SetPhysicsTrans(model, snapObjects)
{
    // Applying user forces
    var wasDown = model.Physics.downEvent;
    var downForce = model.Physics.downForce;
    var leftEvent = model.Physics.leftEvent;
    var rightEvent = model.Physics.rightEvent;
    var leftForce = model.Physics.leftForce;
    var rightForce = model.Physics.rightForce;

    var addedForce;
    if(leftEvent && rightEvent)
    {
        addedForce = rightForce - leftForce;
        model.Physics.xy_velocity[0] = addedForce;
    }
    else if(leftEvent)
    {
        addedForce = -leftForce;
        model.Physics.xy_velocity[0] = addedForce;
    }
    else if(rightEvent)
    {
        addedForce = rightForce;
        model.Physics.xy_velocity[0] = addedForce;
    }
    if(model.Physics.downEvent)
    {
        model.Physics.xy_velocity[1] -= model.Physics.downForce;
    }
    if(model.Physics.jumpEvent && model.Physics.snappedToGround)
    {
        // Remove gravitational influence when snapped to ground
        model.Physics.xy_velocity[1] = model.Physics.jumpForce;
        model.Physics.snappedToGround = false;
    }

    var before_transX = model.TransX;
    var before_transY = model.TransY;
    model.TransX += model.Physics.xy_velocity[0];
    model.TransY += model.Physics.xy_velocity[1];

    if(leftEvent || rightEvent)
    {
        model.Physics.xy_velocity[0] -= addedForce;
    }

    var moved_hitbox_after = GetMovedHitbox(model, model.TransX, model.TransY, model.Rotation);

    // This initialized implies that we want it not rendered if off the screen
    if(model.Physics.onScreen == true)
    {
        console.log(moved_hitbox_after);
        OffScreen(model, moved_hitbox_after);
        return;
    }

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
                model.Physics.snappedToGround = true;
                model.Physics.jumpEvent = false;
                model.Physics.downEvent = false;
                model.Physics.snapObjHitbox = obj_moved_hitbox;
                return;
            }
            else
            {
                model.Physics.snappedToGround = false;
            }
        }
    }
    if(wasDown)
    {
        model.Physics.xy_velocity[1] += downForce;
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
