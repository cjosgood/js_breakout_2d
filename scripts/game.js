//creates canvas
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

//game animation rate
draw();

//position of ball at start
var x = canvas.width/2;
var y = canvas.height - 30;

//radius of the ball
var radiusOfBall = 15;

//making ball move a little
var dx = 2;
var dy = -2;

//paddle and setting it in the center
var paddleHeight = 15;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

//arrow key actions
var rightPressed = false;
var leftPressed = false;

//bricks and padding
var brickRowCount = 5;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 25;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//var to hold score value
var score = 0;

//var to keep count of our lives
var lives = 3;

//create an array to draw the bricks
var bricks = [];
for(c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x:0, y:0, status: 1}; //add a status to the bricks so we can remove when they are hit
    }
}

//event listener to keyup and keydown
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

//drawing the bricks
function drawBricks() {
    for(c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            //draw the bricks only if the status is 1
            if(bricks[c][r].status == 1) {
            //var for brick positions
                var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = "purple";
                context.fill();
                context.closePath();
            }
        }
    }
}

//draw score on canvas
function drawScore() {
    context.font = "16px Comic Sans MS";
    context.fillStyle = "yellow";
    context.fillText("Score: " + score, 8, 20);
}

//draw lives on the canvas
function drawLives() {
    context.font = "16px Comic Sans MS";
    context.fillStyle = "red";
    context.fillText("Lives: " + lives, canvas.width-65, 20);
}

//functions for key presses
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37){
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37){
        leftPressed = false;
    }
}


//draw ball
function drawBall() {
    context.beginPath();
    context.arc(x, y, radiusOfBall, 0, Math.PI*2, true);  //arc method is used to draw circles
    context.fillStyle = "darkgrey";
    context.fill();
    context.closePath();
}

//drawing the paddle
function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    context.fillStyle = "cyan";
    context.fill();
    context.closePath();
}

function breakBricks() {
    for(c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r]; //set status to zero if hit by ball
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy; //change direction of ball if it hits bricks
                    b.status = 0;
                    score++;
                    dx += .75;
                    dy += .75;

                    //if we win
                    if(score == brickColumnCount*brickRowCount) {
                        alert("You Win!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    breakBricks();

    //collision detection
    if(y + dy < radiusOfBall) {
        dy = -dy;
    }

    else if (y + dy > canvas.height-radiusOfBall) {
        
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } 
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(x + dx > canvas.width-radiusOfBall || x + dx < radiusOfBall) {
        dx = -dx;
    }

    //moving the paddle
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    } 
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);

    document.addEventListener("mousemove", mouseMoveHandler);

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if(relativeX > 0+paddleWidth/2 && relativeX < canvas.width-paddleWidth/2) {
            paddleX = relativeX - paddleWidth/2;
        }
    }
}