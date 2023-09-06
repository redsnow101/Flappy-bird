
let board;
let boardWidth=1400 ;
let boardHeight= 800;
let context;

///ratio of bg is 7:4
let birdWidth =42 ;
let birdHeight=24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

///physics
let velocityX = -6;//pipes moving left
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw bird image
    //context.fillStyle = "red";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    ///load bird image
    birdImg = new Image;
    birdImg.src = "images/flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg , birdX, birdY, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "images/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "images/bottompipe.png";
    
    requestAnimationFrame(update);
    setInterval(placePipes, 1000);
    document.addEventListener("keydown", moveBird);

}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }

    context.clearRect( 0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    ///bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 80);//applying gravity to current bird and limiting the bird to go upwards outside of frame
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }
    //pipes
    for(let i =0; i<pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX; 
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height); 
    
        if (!pipe.passed && bird.x > pipe.x + pipe.width){
            score +=0.5;//because of two pipes
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length  > 0 && pipeArray[0].x < 0){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", boardWidth/2.5, boardHeight/2);
    }   

}

function placePipes(){
    if(gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = boardHeight/4;

    let topPipe= {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(bottomPipe); 
}

function moveBird(e){
    if(e.code== "Space" || e.code=="ArrowUp"){
        velocityY = -6;

        //reset game
        if(gameOver){
            bird.y = birdY;
            pipeArray  = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;

}