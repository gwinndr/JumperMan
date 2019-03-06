/*
    Damon Gwinn
    JumperMan main file
*/

// Difficulty
var DIFFICULTY = "Easy";
//var DIFFICULTY = "Normal";
//var DIFFICULTY = "Hard";

// WebGL needed variables
var gl;
var time_label;
var score_label;
var ShaderProgram;

// Jumperman Model and his pellets
var JumperManModel;
var PelletModel;

// List of the spikes trying to kill us
var MovingSpikeModels;
var TimeMaxWaitSpikes = 0.75;

// Environment models
var BigPlatformModel;
var SmallPlatformModel1;
var SmallPlatformModel2;

// Game states
var GameStartTimeSeconds;
var GameWon;
var GameLost;
var TimeToWinSeconds = 30;
var Score;

// Model tweaking
var NumPolyPerCircle = 100;
var JumperManSize = 0.15;
var SpikeModelSize = 0.15;
var PelletSize = 0.02;
var SpikePelletHits = 2;

// Physics tweaking
var GravPixelsPerSecond = 9.8 * 2.5;
var LeftRightForce = 0.01;
var JumpForce = 0.025;
var DownForce = 0.0090;
var SpikeModelVelocity = 0.015;
var ShootForce = 0.04;

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

    time_label = document.getElementById("time-label");
    time_label.innerHTML = "Time: 0";
    score_label = document.getElementById("score-label");
    score_label.innerHTML = "Score: 0";

    // Set up the viewport
    gl.viewport( 0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT );   // x, y, width, height

    // Set up the background color
    gl.clearColor( 0.90, 0.90, 0.90, 1.0 );

    ShaderProgram = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( ShaderProgram );

    JumperManModel = InitJumperManModel(JumperManSize, NumPolyPerCircle);
    PelletModel = InitPelletModel(PelletSize, NumPolyPerCircle);

    GameWon = false;
    GameLost = false;
    Score = 0;

    InitializeSpikeTraps();

    initializeEnvironment();
    InitPhysics(PelletModel, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    InitPhysics(JumperManModel, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    StartGravityEvent(JumperManModel);

    GameStartTimeSeconds = GetSecondsSinceEpoch();
    render();
}

// Renders the full scene
function render()
{
    if(GameWon == true)
    {
        gl.clearColor( 0.0, 1.0, 0.0, 1.0 );
    }
    else if(GameLost == true)
    {
        gl.clearColor( 1.0, 0.0, 0.0, 1.0 );
    }

    gl.clear( gl.COLOR_BUFFER_BIT );
    renderEnvironment();

    if(GameWon == false && GameLost == false)
    {
        AddGravity(JumperManModel, GravPixelsPerSecond);
        SetPhysicsTrans(JumperManModel, [BigPlatformModel, SmallPlatformModel1, SmallPlatformModel2]);

        MovePellet();
        MoveSpikes();

        StartMovingSpikes();

        PelletSpikeCollision();
        PlayerSpikeCollision();

        if(GameLost == true)
        {
            render();
            return;
        }

        CheckWin();
        if(GameWon == true)
        {
            render();
            return;
        }
    }

    RenderModel(JumperManModel, ShaderProgram);
    RenderSpikes();

    if(GameWon == false && GameLost == false)
    {
        requestAnimFrame(render);
    }
}

// Checks if we won
// To win you must survive for the period set by TimeToWinSeconds
function CheckWin()
{
    var cur_t = GetSecondsSinceEpoch();
    var time_survived = (cur_t - GameStartTimeSeconds);
    time_label.innerHTML = "Time: " + Math.floor(time_survived.toString());

    if( time_survived >= TimeToWinSeconds )
    {
        GameWon = true;
    }
}

// Renders the environment
function initializeEnvironment()
{
    BigPlatformModel = InitPlatformModel(2.0, 0.09);
    SmallPlatformModel1 = InitPlatformModel(0.4, 0.05);
    SmallPlatformModel2 = InitPlatformModel(0.4, 0.05);

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

// Initializes spike traps
function InitializeSpikeTraps()
{
    MovingSpikeModels = [];

    var spike1 = InitSpikeModel(SpikeModelSize);
    InitPhysics(spike1, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    spike1.NumPelletHits = 0;
    spike1.Render = false;
    spike1.Range = [-0.2, -0.1];
    spike1.Time = GetSecondsSinceEpoch() + Math.round(Math.random() * TimeMaxWaitSpikes);
    console.log(spike1.Time);
    MovingSpikeModels.push(spike1);

    if(DIFFICULTY == "Normal" || DIFFICULTY == "Hard")
    {
        var spike4 = InitSpikeModel(SpikeModelSize);
        InitPhysics(spike4, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        spike4.NumPelletHits = 0;
        spike4.Render = false;
        spike4.Range = [-0.2, -0.1];
        spike4.Time = GetSecondsSinceEpoch() + Math.round(Math.random() * TimeMaxWaitSpikes);
        console.log(spike4.Time);
        MovingSpikeModels.push(spike4);
    }

    var spike2 = InitSpikeModel(SpikeModelSize);
    InitPhysics(spike2, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    spike2.NumPelletHits = 0;
    spike2.Render = false;
    spike2.Range = [0.2, 0.3];
    spike2.Time = GetSecondsSinceEpoch() + Math.round(Math.random() * TimeMaxWaitSpikes);
    console.log(spike2.Time);
    MovingSpikeModels.push(spike2);

    if(DIFFICULTY == "Hard")
    {
        var spike5 = InitSpikeModel(SpikeModelSize);
        InitPhysics(spike5, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
        spike5.NumPelletHits = 0;
        spike5.Render = false;
        spike5.Range = [0.2, 0.3];
        spike5.Time = GetSecondsSinceEpoch() + Math.round(Math.random() * TimeMaxWaitSpikes);
        console.log(spike5.Time);
        MovingSpikeModels.push(spike5);
    }

    var spike3 = InitSpikeModel(SpikeModelSize);
    InitPhysics(spike3, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    spike3.NumPelletHits = 0;
    spike3.Render = false;
    spike3.Range = [0.5, 0.6];
    spike3.Time = GetSecondsSinceEpoch() + Math.round(Math.random() * TimeMaxWaitSpikes );
    console.log(spike3.Time);
    MovingSpikeModels.push(spike3);
}

// Starts the moving spikes randomly based on the set range
// NOTE: Time must be within TimeWaitSpikes to start moving spike
function StartMovingSpikes()
{
    var cur_t = GetSecondsSinceEpoch();
    for(var i=0; i < MovingSpikeModels.length; ++i)
    {
        var spike = MovingSpikeModels[i];
        if(spike.Physics.crossedScreen == true && (cur_t - spike.Time) >= TimeMaxWaitSpikes)
        {
            getRandomSpikeMovement(spike, spike.Range[0], spike.Range[1], SpikeModelVelocity);
            spike.NumPelletHits = 0;
            spike.Render = true;
            spike.Time = -1;
        }
    }
}

// Moves the Spikes
function MoveSpikes()
{
    for(var i = 0; i < MovingSpikeModels.length; ++i)
    {
        var spike_model = MovingSpikeModels[i];
        if(spike_model.Physics.crossedScreen == false)
        {
            SetPhysicsTrans(spike_model);
            if(spike_model.Physics.crossedScreen == true)
            {
                spike_model.Render = false;
                spike_model.Time = GetSecondsSinceEpoch() + Math.round(Math.random() * TimeMaxWaitSpikes );
            }
        }
    }
}

// Moves the Pellet
function MovePellet()
{
    if(PelletModel.Physics.onScreen == true)
    {
        SetPhysicsTrans(PelletModel);
        if(PelletModel.Physics.onScreen == true)
        {
            RenderModel(PelletModel, ShaderProgram);
        }
    }
}

// Checks for Pellet-Spike collisions
function PelletSpikeCollision()
{
    if(PelletModel.Physics.onScreen == true)
    {
        for(var i = 0; i < MovingSpikeModels.length; ++i)
        {
            var spike_model = MovingSpikeModels[i];
            if(spike_model.Render == true && ObjectsCollided(PelletModel, spike_model))
            {
                PelletModel.Physics.onScreen = false;
                ++spike_model.NumPelletHits;
                if(spike_model.NumPelletHits >= SpikePelletHits)
                {
                    ++Score;
                    score_label.innerHTML = "Score: " + Score.toString();

                    spike_model.Render = false;
                }
            }
        }
    }
}

// Checks for Player-Spike collisions
function PlayerSpikeCollision()
{
    for(var i = 0; i < MovingSpikeModels.length; ++i)
    {
        var spike_model = MovingSpikeModels[i];
        if(spike_model.Render == true && ObjectsCollided(JumperManModel, spike_model))
        {
            GameLost = true;
            return;
        }
    }
}

// Renders spikes
function RenderSpikes()
{
    for(var i = 0; i < MovingSpikeModels.length; ++i)
    {
        var spike_model = MovingSpikeModels[i];
        if(spike_model.Render == true)
        {
            RenderModel(spike_model, ShaderProgram);
        }
    }
}
