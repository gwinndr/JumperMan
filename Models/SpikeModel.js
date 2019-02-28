/*
    Damon Gwinn
    The model for the spikes
    Just simple triangles
*/

// Function to create the SpikeModel (just a triangle really)
// Model returned as a data structure to be used with RenderModel
// Size allows you to tweak the overall size of the model
function InitSpikeModel(size, numPolyPerCircle, numSpikes)
{
    var Vertices = [
        scale(size, vec3(0.0, 1.0, 0.0) ),
        scale(size, vec3(0.45, -1.0, 0.0) ),
        scale(size, vec3(-0.45, -1.0, 0.0) )
    ];

    var Colors = [
        vec4(0.50, 0.0, 0.0, 1.0)
    ];

    // Setting up the polygon metadata
    var PolygonMeta = [
        // Circle
        {count: 3, triangle_fan: false}
    ];


    var buf_vert = gl.createBuffer();

    var spikeModel = {
        Vertices: Vertices,
        PolygonMeta: PolygonMeta,
        Colors: Colors,
        Buf_Vert: buf_vert,
        TransX: 0.0,
        TransY: 0.0,
        Rotation: 0.0
    };

    return spikeModel;
}
