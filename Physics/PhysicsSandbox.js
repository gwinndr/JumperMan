/*
    Damon Gwinn
    JumperMan Physics testing playground
*/

var gl;
var ShaderProgram;
var JumperManModel;
var SpikeModel;
var BigPlatformModel;
var SmallPlatformModel1;
var SmallPlatformModel2;
var PelletModel;
var MovingSpikeModel;

var GamePaused;
var GravPixelsPerSecond;

var SpikeModelSize;
var SpikeModelVelocity;

var VIEWPORT_WIDTH = 1000;
var VIEWPORT_HEIGHT = 800;


// Entry
function init()
{
    // Set up the canvas
    var canvas=document.getElementById("gl-canvas");
    gl=WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert( "WebGL is not available" ); }
    canvas.width = VIEWPORT_WIDTH;
    canvas.height = VIEWPORT_HEIGHT;

    // Set up the viewport
    gl.viewport( 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT );   // x, y, width, height

    // Set up the background color
    gl.clearColor( 0.90, 0.90, 0.90, 1.0 );

    ShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( ShaderProgram );

    JumperManModel = InitJumperManModel(0.15, 100);
    BigPlatformModel = InitPlatformModel(2.0, 0.09);
    SmallPlatformModel1 = InitPlatformModel(0.4, 0.05);
    SmallPlatformModel2 = InitPlatformModel(0.4, 0.05);
    PelletModel = InitPelletModel(0.02, 100);

    GamePaused = false;
    GravPixelsPerSecond = 9.8 * 2.5;
    LeftRightForce = 0.01;
    JumpForce = 0.025;
    DownForce = 0.0090;
    SpikeModelSize = 0.15;
    SpikeModelVelocity = 0.02;
    ShootForce = 0.04;

    SpikeModel = InitSpikeModel(SpikeModelSize);
    MovingSpikeModel = InitSpikeModel(SpikeModelSize);
    InitPhysics(MovingSpikeModel, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    initializeEnvironment();
    InitPhysics(PelletModel, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    InitPhysics(JumperManModel, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    StartGravityEvent(JumperManModel);

    render();
}

// Renders the full scene
function render()
{
    // Force the WebGL context to clear the color buffer
    gl.clear( gl.COLOR_BUFFER_BIT );
    renderEnvironment();

    if(GamePaused == false)
    {
        AddGravity(JumperManModel, GravPixelsPerSecond);
        SetPhysicsTrans(JumperManModel, [BigPlatformModel, SmallPlatformModel1, SmallPlatformModel2]);
        if(ObjectsCollided(JumperManModel, SpikeModel))
        {
            console.log("STATIC SPIKE COLLISION!");
        }


        if(PelletModel.Physics.onScreen == true)
        {
            SetPhysicsTrans(PelletModel);
            if(ObjectsCollided(PelletModel, SpikeModel) || ObjectsCollided(PelletModel, MovingSpikeModel))
            {
                console.log("SPIKE SHOT!");
                PelletModel.Physics.onScreen = false;
            }
            else
                RenderModel(PelletModel, ShaderProgram);
        }

        if(MovingSpikeModel.Physics.crossedScreen == false)
        {
            //ApplyMovementForces(MovingSpikeModel);
            SetPhysicsTrans(MovingSpikeModel);
            if(ObjectsCollided(JumperManModel, MovingSpikeModel))
            {
                console.log("MOVING SPIKE COLLISION!");
            }

            if(MovingSpikeModel.Physics.crossedScreen == false)
            {
                RenderModel(MovingSpikeModel, ShaderProgram);
            }
        }
        else
        {
            getRandomSpikeMovement(MovingSpikeModel, -0.3, -0.1, SpikeModelVelocity);
        }

    }

    RenderModel(SpikeModel, ShaderProgram);
    RenderModel(JumperManModel, ShaderProgram);

    if(GamePaused == false)
    {
        requestAnimFrame(render);
    }
}

// Renders the environment
function initializeEnvironment()
{
    BigPlatformModel.TransY = -0.4

    SmallPlatformModel1.TransX = -0.5;
    SmallPlatformModel1.TransY = 0.0;

    SmallPlatformModel2.TransX = 0.5;
    SmallPlatformModel2.TransY = 0.0;

    // Placeholder spike for testing
    SpikeModel.TransX = 0.4;
    SpikeModel.TransY = 0.4;
    SpikeModel.Rotation = Math.PI;
}

// Renders the environment
function renderEnvironment()
{
    RenderModel(BigPlatformModel, ShaderProgram);
    RenderModel(SmallPlatformModel1, ShaderProgram);
    RenderModel(SmallPlatformModel2, ShaderProgram);
}
