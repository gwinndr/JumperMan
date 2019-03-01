/*
    Damon Gwinn
    JumperMan main file
*/

var gl;
var ShaderProgram;
var JumperManModel;
var SpikeModel;
var BigPlatformModel;
var SmallPlatformModel1;
var SmallPlatformModel2;
var PelletModel;

// Entry
function init()
{
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }

    // Set up the viewport
    gl.viewport( 0, 0, 1000, 800 );   // x, y, width, height

    // Set up the background color
    gl.clearColor( 0.90, 0.90, 0.90, 1.0 );

    ShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( ShaderProgram );

    JumperManModel = InitJumperManModel(1.0, 100);
    SpikeModel = InitSpikeModel(0.2);
    BigPlatformModel = InitPlatformModel(2.0, 0.09);
    SmallPlatformModel1 = InitPlatformModel(0.4, 0.05);
    SmallPlatformModel2 = InitPlatformModel(0.4, 0.05);
    PelletModel = InitPelletModel(0.02, 100);

    initializeEnvironment();
    render();
}

// Renders the full scene
function render()
{
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );
    renderEnvironment();
}

// Renders the environment
function initializeEnvironment()
{
    BigPlatformModel.TransY = -0.4

    SmallPlatformModel1.TransX = -0.5;
    SmallPlatformModel1.TransY = 0.0;

    SmallPlatformModel2.TransX = 0.5;
    SmallPlatformModel2.TransY = 0.0;
}

// Renders the environment
function renderEnvironment()
{
    RenderModel(BigPlatformModel, ShaderProgram);
    RenderModel(SmallPlatformModel1, ShaderProgram);
    RenderModel(SmallPlatformModel2, ShaderProgram);
}
