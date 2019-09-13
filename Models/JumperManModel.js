/*
    Damon Gwinn
    The model for the main character
*/

// Function to create the JumperManModel
// Model returned as a data structure to be used with RenderModel
// Size allows you to tweak the overall size of the model
// numPolyPerCircle allows for a variable number of polygons per circular object
function InitJumperManModel(size, numPolyPerCircle)
{
    var Vertices = [
        // Head
        scale(size, vec3( -0.2, 1.0, .0)),
        scale(size, vec3(  0.2, 1.0, .0)),
        scale(size, vec3( -0.2, 0.6, .0)),
        scale(size, vec3(  0.2, 0.6, .0)),

        // Body_Left
        scale(size, vec3( -0.4,  0.6, .0)),
        scale(size, vec3( -0.1,  0.6, .0)),
        scale(size, vec3( -0.4, -0.6, .0)),
        scale(size, vec3( -0.1, -0.6, .0)),

        // Body_Right
        scale(size, vec3( 0.1,  0.6, .0)),
        scale(size, vec3( 0.4,  0.6, .0)),
        scale(size, vec3( 0.1, -0.6, .0)),
        scale(size, vec3( 0.4, -0.6, .0)),

        // Body_Center
        scale(size, vec3( -0.1,  0.6, .0)),
        scale(size, vec3( 0.1,  0.6, .0)),
        scale(size, vec3( -0.1, -0.6, .0)),
        scale(size, vec3( 0.1, -0.6, .0)),
    ];

    // Grabbing circle-based polygons
    var center;
    var width_height;

    // Left hand
    center          = scale(size, vec2( -0.397, 0.35 ));
    width_height    = scale(size, vec2( 0.2, 0.1 ));
    AddHalfCircleToVert(Vertices, numPolyPerCircle, center, width_height, Math.PI/2);

    // Right hand
    center          = scale(size, vec2( 0.397, 0.35 ));
    width_height    = scale(size, vec2( 0.2, 0.1 ));
    AddHalfCircleToVert(Vertices, numPolyPerCircle, center, width_height, -Math.PI/2);

    // Left Foot
    center          = scale(size, vec2( -0.2, -0.597 ));
    width_height    = scale(size, vec2( 0.1, 0.2 ));
    AddHalfCircleToVert(Vertices, numPolyPerCircle, center, width_height, Math.PI);

    // Right Foot
    center          = scale(size, vec2( 0.2, -0.597 ));
    width_height    = scale(size, vec2( 0.1, 0.2 ));
    AddHalfCircleToVert(Vertices, numPolyPerCircle, center, width_height, Math.PI);

    // Left_Eye
    center          = scale(size, vec2( -0.07, 0.85));
    width_height    = scale(size, vec2( 0.03, 0.06 ));
    AddCircleToVert(Vertices, numPolyPerCircle, center, width_height, 0.0);

    // Right_Eye
    center          = scale(size, vec2( 0.07, 0.85));
    width_height    = scale(size, vec2( 0.03, 0.06 ));
    AddCircleToVert(Vertices, numPolyPerCircle, center, width_height, 0.0);

    var Colors = [
        // Head =  (255,205,148)
        vec4(1.0, 0.8039, 0.5804, 1.0),

        // Body_Left =  rgb(128,0,0)
        vec4(0.0, 0.0, 0.0, 1.0),

        // Body_Right =  rgb(128,0,0)
        vec4(0.0, 0.0, 0.0, 1.0),

        // Body_Center =  (255,255,255)
        vec4(1.0, 1.0, 1.0, 1.0),

        // Left_Hand
        vec4(1.0, 0.8039, 0.5804, 1.0),

        // Right_Hand
        vec4(1.0, 0.8039, 0.5804, 1.0),

        // Left_Foot
        vec4(0.5, 0.5, 0.5, 1.0),

        // Right_Foot
        vec4(0.5, 0.5, 0.5, 1.0),

        // Left_Eye
        vec4(.0, .0, .0, 1.0),

        // Right_Eye
        vec4(.0, .0, .0, 1.0)
    ];

    var buf_vert = gl.createBuffer();

    // Setting up the polygon metadata
    var PolygonMeta = [
        // head
        {count: 4, triangle_fan: false},
        // Body_Left
        {count: 4, triangle_fan: false},
        // Body_Right
        {count: 4, triangle_fan: false},
        // Body_Center
        {count: 4, triangle_fan: false},
        // Left_Hand
        {count: numPolyPerCircle, triangle_fan: true},
        // Right_Hand
        {count: numPolyPerCircle, triangle_fan: true},
        //Left_Foot
        {count: numPolyPerCircle, triangle_fan: true},
        //Right_Foot
        {count: numPolyPerCircle, triangle_fan: true},
        // Left_Eye
        {count: numPolyPerCircle, triangle_fan: true},
        // Right_Eye
        {count: numPolyPerCircle, triangle_fan: true}
    ];

    var jumperMan = {
        Vertices: Vertices,
        PolygonMeta: PolygonMeta,
        Colors: Colors,
        Buf_Vert: buf_vert,
        TransX: 0.0,
        TransY: 0.0,
        Rotation: 0.0,
        Type: "JumperMan"
    };

    InitJumperManHitbox(jumperMan, size, false);

    return jumperMan;
}

// Generates the hitbox
// renderIt tells whether or not the hitbox should be rendered
function InitJumperManHitbox(model, size, renderIt)
{
    var upperleft = scale(size, vec3( -0.4,  0.6, .0));
    var bottomright = scale(size, vec3(0.41, -0.6, .0));
    upperleft.push(1.0);
    bottomright.push(1.0);

    model.Hitbox = [
        upperleft,
        bottomright
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
        model.Colors.push(vec4(0.3, 0.3, 0.3, 1.0));
        model.PolygonMeta.push({count: 4, triangle_fan: false});
    }
}
