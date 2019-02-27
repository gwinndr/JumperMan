/*
    Damon Gwinn
    Test environment with a grey background
    Used to look at created models
*/

var gl;
var ShaderProgram;
var JumperManModel;

// Initializes the model test environment with a light-grey background
function initTestEnvironment()
{
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }

    // Set up the viewport
    gl.viewport( 0, 0, 900, 700 );   // x, y, width, height

    // Set up the background color
    gl.clearColor( 0.90, 0.90, 0.90, 1.0 );

    ShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( ShaderProgram );

    JumperManModel = InitJumperManModel(0.3, 100);
    render();
}

// Renders the target object (NOTE: Animation not rendered)
function render()
{
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );
    RenderModel(JumperManModel, ShaderProgram);
}
