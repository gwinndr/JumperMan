/*
    Damon Gwinn
    Collision engine
*/

// Determining that no rectangles collide by ensuring neither are inside one another
function RectanglesCollided(upperleft1, bottomright1, upperleft2, bottomright2)
{
    return (upperleft1[0] < bottomright2[0] &&
            bottomright1[0] > upperleft2[0] &&
            bottomright1[1] < upperleft2[1] &&
            upperleft1[1] > bottomright2[1]);
}

// Returns a moved hitbox
function GetMovedHitbox(model, transX, transY, rot)
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
