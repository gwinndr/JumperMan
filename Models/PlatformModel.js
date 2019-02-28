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
        vec4(0.30, 0.30, 0.30, 1.0)
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
        Rotation: 0.0
    };

    return platformModel;
}
