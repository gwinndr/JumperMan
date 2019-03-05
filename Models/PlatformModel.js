/*
    Damon Gwinn
    The model for the platforms in the environment
    Drawn via rectangles
*/

// Function to create the platforms which is a rectangle
// Length and height specify the rectangle's parameters
function InitPlatformModel(length, height)
{
    var half_length = length/2.0;
    var half_height = height/2.0;
    var Vertices = [
        vec3(half_length, half_height, 0.0),
        vec3(-half_length, half_height, 0.0),
        vec3(half_length, -half_height, 0.0),
        vec3(-half_length, -half_height, 0.0)
    ];

    var Colors = [
        //0-0-128
        vec4(0.0, 0.0, 0.3, 1.0)
    ];

    // Setting up the polygon metadata
    var PolygonMeta = [
        // Circle
        {count: 4, triangle_fan: false}
    ];


    var buf_vert = gl.createBuffer();

    var platformModel = {
        Vertices: Vertices,
        PolygonMeta: PolygonMeta,
        Colors: Colors,
        Buf_Vert: buf_vert,
        TransX: 0.0,
        TransY: 0.0,
        Rotation: 0.0,
        Type: "Environment"
    };

    InitPlatformHitbox(platformModel, length, height, false);

    return platformModel;
}

function InitPlatformHitbox(model, length, height, renderIt)
{
    var half_length = length/2.0;
    var half_height = height/2.0;

    var upperleft = vec4(-half_length, half_height, .0, 1.0);
    var bottomright = vec4(half_length, -half_height, .0, 1.0);

    model.Hitbox = [
        vec4(-half_length, half_height, .0, 1.0),
        vec4(half_length, -half_height, .0, 1.0)
    ];
    model.HitboxType = "Rect";

    // Making sure it's a boolean
    if(renderIt == true)
    {
        model.Vertices.push(upperleft,
            vec3(-upperleft[0], upperleft[1], .0),
            vec3(upperleft[0], bottomright[1], .0),
            bottomright
        );
        model.Colors.push(vec4(1.0, 1.0, 1.0, 1.0));
        model.PolygonMeta.push({count: 4, triangle_fan: false});
    }
}
