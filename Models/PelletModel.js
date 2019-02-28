/*
    Damon Gwinn
    The model for the pellets that JumperMan shoots at the spikes
    Drawn via circles
*/

// Function to create the pellets
// Radius give the radius of the pellet
// numPoly is the number of triangles used to make the circle
function InitPelletModel(radius, numPoly)
{
    var Vertices = [];
    var center = [0.0, 0.0];
    widthHeight = [0.7778*radius, 1.0*radius];
    rotation = .0;
    AddCircleToVert(Vertices, numPoly, center, widthHeight, rotation)

    var Colors = [
        vec4(.0, .0, .0, 1.0)
    ];

    // Setting up the polygon metadata
    var PolygonMeta = [
        {count: numPoly, triangle_fan: true}
    ];


    var buf_vert = gl.createBuffer();

    var pelletModel = {
        Vertices: Vertices,
        PolygonMeta: PolygonMeta,
        Colors: Colors,
        Buf_Vert: buf_vert,
        TransX: 0.0,
        TransY: 0.0,
        Rotation: 0.0
    };

    return pelletModel;
}
