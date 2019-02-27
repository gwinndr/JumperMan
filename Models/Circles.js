/*
    Damon Gwinn
    Function for circle creation
*/

// Adds a full circle with specified width, height and rotation
function AddCircleToVert(vertices, numPoly, center, widthHeight, rotation)
{
    var c_x = center[0];
    var c_y = center[1];
    var width = widthHeight[0];
    var height = widthHeight[1];

    var step_theta = (2*Math.PI) / numPoly;

    // Adjusting the start theta to account for assymmetric shapes with fewer sides
    var start_theta = (step_theta / 2) + rotation;
    var end_theta = (2 * Math.PI) + (step_theta/2) + rotation;

    // Ellipse formula
    //x = c cos(theta) + a
    //y = d sin(theta) + b
    var x;
    var y;
    var point_num = 0;
    for(var theta = start_theta; theta < end_theta && point_num < numPoly; theta += step_theta)
    {
        x = width * Math.cos(theta) + c_x;
        y = height * Math.sin(theta) + c_y;

        vertices.push(vec3(x, y, 1.0));
        point_num += 1;
    }
}

// Adds a half-circle with specified width and height and rotation
// NOTE: This gives a half circle and you should pass half the number of vertices you actually want
function AddHalfCircleToVert(vertices, numPoly, center, widthHeight, rotation)
{
    var c_x = center[0];
    var c_y = center[1];
    var width = widthHeight[0];
    var height = widthHeight[1];

    var step_theta = (Math.PI) / (numPoly);

    // Adjusting the start theta to account for assymmetric shapes with fewer sides
    var start_theta = (step_theta / 2) + rotation;
    var end_theta = (Math.PI) + (step_theta/2) + rotation;

    // Ellipse formula
    //x = c cos(theta) + a
    //y = d sin(theta) + b
    var x;
    var y;
    var point_num = 0;
    for(var theta = start_theta; theta < end_theta && point_num < numPoly; theta += step_theta)
    {
        x = width * Math.cos(theta) + c_x;
        y = height * Math.sin(theta) + c_y;

        vertices.push(vec3(x, y, 1.0));
        point_num += 1;
    }
}
