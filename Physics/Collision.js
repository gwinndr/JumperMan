/*
    Damon Gwinn
    Collision engine
*/

// Determining if two objects collided using their hitboxes
// WARNING: This is not generalized as of yet
function ObjectsCollided(object1, object2)
{
    // Currently unused
    if(object1.HitboxType == "Rect" && object2.HitboxType == "Rect")
    {
        object1_moved = GetMovedHitbox(object1, object1.TransX, object1.TransY, object1.Rotation);
        object2_moved = GetMovedHitbox(object2, object2.TransX, object2.TransY, object2.Rotation);

        upperleft1 = object1_moved[0];
        bottomright1 = object1_moved[1];
        upperleft2 =object2_moved[0];
        bottomright2 = object2_moved[1];

        return (upperleft1[0] < bottomright2[0] &&
                bottomright1[0] > upperleft2[0] &&
                bottomright1[1] < upperleft2[1] &&
                upperleft1[1] > bottomright2[1]);
    }
    // Detecting collision between player and spike
    else if(object1.HitboxType == "Rect", object2.HitboxType == "Triangle")
    {
        // Rotating to a up-down orientation for simplicity
        object1_moved = GetMovedHitbox(object1, object1.TransX, object1.TransY, object1.Rotation);
        object2_moved = GetMovedHitbox(object2, object2.TransX, object2.TransY, object2.Rotation);

        upperleft = object1_moved[0];
        bottomright = object1_moved[1];
        upperright = vec2(bottomright[0], upperleft[1]);
        bottomleft = vec2(upperleft[0], bottomright[1]);

        for(var i=0; i < object2_moved.length; ++i)
        {
            var obj_start = object2_moved[i];
            var j;
            if((i+1) >= object2_moved.length)
                j = 0;
            else
                j = i+1;

            var obj_end = object2_moved[j];

            var intersection = (
                Intersects(obj_start, obj_end, bottomleft, bottomright) ||
                Intersects(obj_start, obj_end, bottomright, upperright) ||
                Intersects(obj_start, obj_end, upperleft, upperright) ||
                Intersects(obj_start, obj_end, upperleft, bottomleft)
            );

            if(intersection)
            {
                return true;
            }
        }
        return false;
    }
}

// Returns a moved hitbox
function GetMovedHitbox(model, transX, transY, rot)
{
    if(model.HitboxType == "Rect")
    {
        var upperleft = model.Hitbox[0];
        var bottomright = model.Hitbox[1];
        var moved_hitbox = [[.0, .0], [.0, .0]];

        var Transformation = [
            vec4(Math.cos(rot), Math.sin(rot), .0, transX),
            vec4(-Math.sin(rot), Math.cos(rot), .0,  transY)
        ];

        moved_hitbox[0][0] = dot(Transformation[0], upperleft);
        moved_hitbox[0][1] = dot(Transformation[1], upperleft);
        moved_hitbox[1][0] = dot(Transformation[0], bottomright);
        moved_hitbox[1][1] = dot(Transformation[1], bottomright);
        return moved_hitbox;
    }
    else if(model.HitboxType == "Triangle")
    {
        var vert1 = model.Hitbox[0];
        var vert2 = model.Hitbox[1];
        var vert3 = model.Hitbox[2];

        var moved_hitbox = [[.0, .0], [.0, .0], [.0, .0]];

        var Transformation = [
            vec4(Math.cos(rot), Math.sin(rot), .0, transX),
            vec4(-Math.sin(rot), Math.cos(rot), .0,  transY)
        ];

        moved_hitbox[0][0] = dot(Transformation[0], vert1);
        moved_hitbox[0][1] = dot(Transformation[1], vert1);
        moved_hitbox[1][0] = dot(Transformation[0], vert2);
        moved_hitbox[1][1] = dot(Transformation[1], vert2);
        moved_hitbox[2][0] = dot(Transformation[0], vert3);
        moved_hitbox[2][1] = dot(Transformation[1], vert3);
        return moved_hitbox;
    }
}

// Borrowed from:
//  https://stackoverflow.com/questions/14480124/how-do-i-detect-triangle-and-rectangle-intersection
function Intersects(a1, a2, b1, b2)
{
    var b = subtract(a2,a1);
    var d = subtract(b2,b1);
    var bDotDPerp = b[0] * d[1] - b[1] * d[0];

    // Means the lines are parallel so cannot intersect (not checking equality case)
    if (bDotDPerp == 0)
        return false;

    var c = subtract(b1,a1);
    var t = (c[0] * d[1] - c[1] * d[0]) / bDotDPerp;
    if (t < 0 || t > 1)
        return false;

    var u = (c[0] * b[1] - c[1] * b[0]) / bDotDPerp;
    if (u < 0 || u > 1)
        return false;

    return true;
}
