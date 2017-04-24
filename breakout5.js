/*
=============================================================================================
 Name        :  breakout2.js
 Author      :  Cole Dapprich
 Version     :  1.0
 Course      :  CSCE 4250.001 - Topics in Game Development
 Description :  This javascript program, in collaboration with breakout.html, uses the HTML5
                canvas element, a 2-dimensional rendering context, keyboard and mouse
                listeners, and basic animation to create a simple 2D breakout game within a
                browser. Based on code provided by the Mozilla Developer Network (MDN).
                
                THIS VERSION DECREASES USER PERCEPTIONS OF CONTROL AND EFFECTANCE BY HAVING
                PADDLE MOVE AUTOMATICALLY AND THE USER ONLY CONTROL ITS SPEED
                
 Copyright   :  © 2017 CDsoftworks ( AMDG ) - FREE AND OPEN SOURCE. No rights reserved.
=============================================================================================
*/

// global variables
var paddleDX = 3;
var bricksArr = [];
var ballRadius = 7;
var paddleHeight = 7;
var paddleWidth = 60;
var halfPaddleWidth = 30;
var brickRowCount = 13;
var brickColumnCount = 5;
var brickWidth = 35;
var brickHeight = 20;
var brickSeparation = 1;
var brickOffsetTop = 30;
var brickOffsetLeft = 4;
var score = 0;
var numLives = 3;

// web-stored variables
var hiScore = sessionStorage.getItem('hiScore');
if(!hiScore) hiScore = 0;
var notFirstPlay = sessionStorage.getItem('notFirstPlay');

// keyboard listener
var rightPressed = false;
var leftPressed = false;

// object coordinates
var x;
var y;
var paddleX;

// ball velocity
var dx = 3;
var dy = -3;

function main()
{
    // welcome message
    if (!notFirstPlay)
        alert("Welcome to Breakout!\n\nThe paddle will move back and forth automatically. Use the up and down arrow keys to control its speed. Try to elimate all of the blocks without losing all your lives!");
    
    // get canvas and rendering context
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    
    // initialize global variables that require the use of canvas
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width-paddleWidth) / 2;
    
    // key and mouse listeners
    document.addEventListener("keydown", keyDownHandler, false);
    //document.addEventListener("keyup", keyUpHandler, false);
    //document.addEventListener("mousemove", mouseMoveHandler, false);
    
    initializeBricks();
    
    function tick() // called every frame
    {
        context.clearRect(0, 0, canvas.width, canvas.height); // reset game
        drawBricks(context);
        drawBall(context);
        drawPaddle(context);
        drawScore(context);
        drawLives(context);
        collisionDetection();
    
        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) // wall hit
        {
            dx = -dx; // reflect
        }
        if(y + dy < ballRadius) // ceiling hit
        {
            dy = -dy; // reflect
        }
        else if(y + dy > canvas.height-ballRadius) // paddle collision detection
        {
            if(x > paddleX && x < paddleX + paddleWidth)  // paddle hit
            {
                dy = -dy; // reflect
            }
            
            else // death event (paddle miss)
            {
                numLives--;
                
                if(!numLives) // game over
                {
                    sessionStorage.setItem('notFirstPlay', true);
                    if(score > hiScore) sessionStorage.setItem('hiScore', score);
                    hiScore = sessionStorage.getItem('hiScore');
                    if(!hiScore) hiScore = 0;
                    alert("Game over. Click \"OK\" to play again...\n\nHigh Score: " + hiScore);
                    document.location.reload();
                }
                
                else // numLives > 0
                {
                    // reset game
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 3;
                    dy = -3;
                    //paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        
        /* if(rightPressed && paddleX < canvas.width - paddleWidth) // paddle move right
        {
            paddleX += 7;
        }
        
        else if(leftPressed && paddleX > 0) // paddle move left
        {
            paddleX -= 7;
        } */
        
        if(paddleX + paddleDX > canvas.width - paddleWidth || paddleX + paddleDX < 0) // paddle wall bounce
        {
            paddleDX *= -1; // paddle reflect
        }
        
        paddleX += paddleDX;
        x += dx;
        y += dy;
        requestAnimationFrame(tick, canvas);
    };
    
    tick();
}

function initializeBricks()
{
    for(var i = 0; i < brickColumnCount; i++)
    {
        bricksArr[i] = [];
        for(j = 0; j < brickRowCount; j++) 
        {
            bricksArr[i][j] = { x: 0, y: 0, status: 1 };
        }
    }
}

function collisionDetection()
{
    for(i = 0; i < brickColumnCount; i++)
    {
        for(j = 0; j < brickRowCount; j++) 
        {
            var b = bricksArr[i][j];
            if(b.status == 1) 
            {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) 
                {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount * brickColumnCount) // all bricks cleared
                    {
                        // victory event
                        alert("Congratulations, you win!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall(context) 
{
    context.beginPath();
    context.arc(x, y, ballRadius, 0, Math.PI * 2);
    context.fillStyle = "#000000";
    context.fill();
    context.closePath();
}

function drawPaddle(context) 
{
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "#000000";
    context.fill();
    context.closePath();
}

function drawBricks(context) 
{
    for(var i = 0; i < brickColumnCount; i++)
    {
        for(var j = 0; j < brickRowCount; j++)
        {
            if(bricksArr[i][j].status == 1)
            {
                var brickX = (j * (brickWidth + brickSeparation)) + brickOffsetLeft;
                var brickY = (i * (brickHeight + brickSeparation)) + brickOffsetTop;
                bricksArr[i][j].x = brickX;
                bricksArr[i][j].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "#000000";
                context.fill();
                context.closePath();
            }
        }
    }
}

function drawScore(context)
{
    context.font = "16px Courier Prime";
    context.fillStyle = "#000000";
    context.fillText("Score: " + score, 8, 20);
    context.fillText("High Score: " + hiScore, canvas.width / 2 - 65, 20);
}

function drawLives(context)
{
    context.font = "16px Courier Prime";
    context.fillStyle = "#000000";
    context.fillText("Lives: " + numLives, canvas.width - 85, 20);
}

function keyDownHandler(e)
{
    if(e.keyCode == 38) // up arrow
    {
        if(paddleDX >= 0) paddleDX++;
        else paddleDX--;
    }
    
    else if(e.keyCode == 40) // down arrow 
    {
        if(paddleDX > 0) paddleDX--;
        else if(paddleDX < 0) paddleDX++;
    }
}

/* function keyUpHandler(e) 
{
    if(e.keyCode == 39) 
    {
        rightPressed = false;
    }
    
    else if(e.keyCode == 37) 
    {
        leftPressed = false;
    }
} */

/* function mouseMoveHandler(e)
{
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > halfPaddleWidth && relativeX < (canvas.width - halfPaddleWidth)) // don't allow paddle past edges
    {
        paddleX = relativeX - halfPaddleWidth;
    }
} */