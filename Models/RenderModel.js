/*
    Damon Gwinn
    Function to render a model given a model object

    MODEL OBJECT:
    {
        Vertices: vec3 list of vertices,
        PolygonMeta: PolygonMeta,
        Colors: vec4 list of colors,
        Buf_Vert: gl.createBuffer() object
        TransX: float, X transformation
        TransY: float, Y transformation
        Rotation: float, Rotation in radians
        Hitbox: vec4 list of vertices defining the collision hitbox
    }

    PolygonMeta:
    {
        count: integer for the number of vertices on this polygon
        triangle_fan: bool, True if it should be drawn using gl.TRIANGLE_FAN
                            False to use gl.TRIANGLE_STRIP
    }
*/

function RenderModel(model, shaderProgram)
{
    // BUFFERING VERTICES
    gl.bindBuffer(gl.ARRAY_BUFFER, model.Buf_Vert);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(model.Vertices), gl.STATIC_DRAW);
    var position = gl.getAttribLocation(shaderProgram, "myPosition");
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    var color_unif = gl.getUniformLocation(shaderProgram, "color");
    var trans_unif = gl.getUniformLocation(shaderProgram, "tranformation");

    // Rendering all our faces using the PolygonMeta list that contains polygon info
    var offset = 0;
    var num_points = 0;
    var color_ind = 0;
    var color;
    for(var p_ind = 0; p_ind < model.PolygonMeta.length; ++p_ind)
    {
        meta = model.PolygonMeta[p_ind];
        num_points = meta.count
        color = model.Colors[p_ind];
        color_ind += 1;

        var Transformation = mat4(
            Math.cos(model.Rotation), Math.sin(model.Rotation), .0, model.TransX,
            -Math.sin(model.Rotation), Math.cos(model.Rotation), .0,  model.TransY,
            0, 0, 1, 0,
            0, 0, 0, 1
        );

        gl.uniform4f(color_unif, color[0], color[1], color[2], color[3]);
        gl.uniformMatrix4fv(trans_unif, false, flatten(Transformation));


        if(meta.triangle_fan)
            gl.drawArrays(gl.TRIANGLE_FAN, offset, num_points);
        else
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, num_points);

        offset += num_points;
    }
}
