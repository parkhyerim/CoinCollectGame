// Canvas Setup
/*
let myGameArea = {
    canvas: document.getElementById('mainCanvas'),
    start: function(){
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(canvas);
        this.frameNo = 0;
    },
    clear: function(){
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
}
*/
let canvas;
let ctx;
canvas = document.getElementById('mainCanvas');
ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
document.body.appendChild(canvas);

// Game
let playerImage, coinImage, enemyImage, weaponImage, gameOverImage; 
let gameOver = false;   // if true, game is over
let score = 0;
let health = 10;
let laserSpeed = 7;
let enemySpeed = 4;

// Sound
const bgMusicSound = document.createElement('audio');
bgMusicSound.src = 'audio/gamemusic1.mp3';
const coinSound = document.createElement('audio');
coinSound.src = 'audio/coin.wav';
const collisionSound = document.createElement('audio');
collisionSound.src = 'audio/mine.wav';


// Player
const playerImgLength = 64;
let playerX = canvas.width/2 - playerImgLength/2;    // The player's x position - in the center of the game area
let playerY =canvas.height + playerImgLength;   // The player's y position - on the bottom
//let playerAlive = true;

class Player{
    constructor(){
        this.x =  canvas.width/2 - playerImgLength/2; 
        this.y = canvas.height + playerImgLength; 
        this.name = "robot";
    }
}

// Coin
let coinArray = [];
const coinImgLength = 64;
class Coin {
    constructor(){
        this.x = generateRandomValue(130, canvas.width - coinImgLength); // to make the game UI for score&health visiable
        this.y = generateRandomValue(80, canvas.height - coinImgLength);
       // this.collected = false;
    }
}

//Enemy (Bomb)
let enemyArray = [];
let enemyImageLength = 64;
class Enemy {
    constructor(){
        this.x = generateRandomValue(0, canvas.width - enemyImageLength);
        this.y = 0;
        enemyArray.push(this);
    }

    update(){
        this.y += enemySpeed;
    }
}

// Laser beam
let laserList = [];
let laserImgLength = 64;
class LaserBeam {
    constructor(){
        this.x = playerX;
        this.y = playerY;
        this.canUse = false;
        laserList.push(this);
    }
    
    update(){
        console.log(keysDown);
        this.y -= laserSpeed;
    }
}

function checkLaserHit(){
    /*
    for(let i=0; laserList.length; i++){
        for(let j=0; enemyArray.length; j++){
            //if(laserList[i].x )
            console.log(laserList[i] + ' ' + enemyArray[j]);
        }
      
    }*/
}
/*
function LaserBeam(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.x = playerX;   
        this.y = playerY;
        this.alive = true;  
        laserList.push(this);
    };
    this.update = function(){
        console.log(keysDown);
        this.x -= laserSpeed;
    };
 
    this.checkHit=function(){
        if(enemyArray.length >0){
            for(let i=0; enemyArray.length; i++){
            if(this.y <= enemyArray[i].y && this.x>=enemyArray[i].x &&this.x < enemyArray[i].x+64){
                score++;
                this.alive = false;
                enemyArray.splice(i,1);
            }
        }  
        }
       
    };
}
*/

function spawnCoin(){
    if(coinArray.length < 1){
        coinArray.push(new Coin()); // spawn only one coin
    }

    for(let i=0; i < coinArray.length; i++){
        if(Math.abs(coinArray[i].x - playerX) <= coinImgLength/2 
        && Math.abs(coinArray[i].y - playerY) <= coinImgLength/2){
            // console.log("collide with coin");     
            coinSound.play(); 
            coinArray.splice(i, 1);
            score++;        
        }
    }
}

function checkCollideWithEnemy(){
    for(let i=0; i< enemyArray.length; i++){
        if(Math.abs(enemyArray[i].y - playerY) < enemyImageLength -10 
        && Math.abs(enemyArray[i].x- playerX) < enemyImageLength -10){
           // console.log("collide with bomb");
           collisionSound.play();
           enemyArray.splice(i,1);
           health--;       
        }else if(enemyArray[i].y >= canvas.height - enemyImageLength){
            collisionSound.play();
            enemyArray.splice(i,1);
        }
    }
}

function checkScore(){
    if(score < 0){
        gameOver = true;
    }
}

function checkHealth(){
    if(health < 0){
        gameOver = true;
    }
}

function generateRandomValue(min, max){
    let randomNum = Math.floor(Math.random() * (max-min+1)) + min;  
    return randomNum;
}

function loadImage(){
    playerImage = new Image();
    playerImage.src = 'img/player.png';
    coinImage = new Image();
    coinImage.src = 'img/coin.png';
    enemyImage = new Image();
    enemyImage.src = 'img/enemy.png';
    weaponImage = new Image();
    weaponImage.src = 'img/weapon.png';
    gameOverImage = new Image();
    gameOverImage.src = 'img/gameover.jpg';
}


function  render(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.drawImage(playerImage,playerX,playerY);
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`Health: ${health}`, 20, 80);
    ctx.fillStyle = 'black'; 
    ctx.font = '30px Arial';
    for(let i = 0; i< laserList.length; i++){
        if(laserList[i].alive){
            ctx.drawImage(weaponImage, laserList[i].x, laserList[i].y);
        }else{

        }
      
    }

     for(let i = 0; i< enemyArray.length; i++){
        ctx.drawImage(enemyImage, enemyArray[i].x, enemyArray[i].y);
    }

     for(let i = 0; i< coinArray.length; i++){
        ctx.drawImage(coinImage, coinArray[i].x, coinArray[i].y);
    }
}

function main(){
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImage, gameOverImage.width-200,100, gameOverImage.width, gameOverImage.height);
    }  
}


// Keyboard Interaction
const leftKey = 37;
const rightKey = 39;
const upKey = 38;
const downKey = 40;
const spaceBar = 32;
let keysDown = {};
let playerSpeed = 2;

function setupKeyboardListener(){
    document.addEventListener('keydown', function(event){
        keysDown[event.keyCode] = true;
        //console.log('which key: ', keysDown);
    } );
    document.addEventListener('keyup', function(event){
        delete keysDown[event.keyCode];
        //console.log('which key:', keysDown);

    if(event.keyCode == spaceBar && score >= 5){
        shootLaserBeam();
    }
    });    
}

function shootLaserBeam(){
    console.log("bullt");
    laserList.push(new LaserBeam());
   // let b = new LaserBeam();
   // b.init();
}

function createEnemy(){
   // let randomNum = Math.random() * 10000;
    const interval = setInterval(function(){
        let e = new Enemy();
        //e.init();
    }, 5000);
}

function update(){
    // keyboard controll
    if(leftKey in keysDown){ // to the right
        playerX -= playerSpeed;
    } 
    if (rightKey in keysDown){ // to the left
        playerX += playerSpeed;
    }
    if(upKey in keysDown){ // upwards
        playerY -= playerSpeed;
    }
    if(downKey in keysDown){ // downwards
        playerY += playerSpeed;
    }

    // Make the player stay only inside the game area
    if(playerX <= 0){ 
        playerX = 0;
    }
    if(playerX >= canvas.width - playerImgLength){
        playerX = canvas.width -playerImgLength ;
    }
    if(playerY <= 0){
        playerY = 0;
    }
    if(playerY > canvas.height - playerImgLength){
        playerY = canvas.height - playerImgLength;
    }


    // Laserbeam update
    for(let i = 0; i < laserList.length; i++){
        if(laserList[i].alive){
            laserList[i].update();
            laserList[i].checkHit();
        }
    }

    // Coin update - spawning
    spawnCoin();

    // Enenmy update - movement
    for(let i=0; i < enemyArray.length; i++){
        enemyArray[i].update();
    }

    checkHealth();
    checkCollideWithEnemy();
    checkLaserHit();
      
}

function playBGMusic(){
    
}

let player;
function startGame(){
    console.log("start game");
    //loadImage();
    player = new Player();
    console.log(player.name);
}
loadImage();
main();
createEnemy();
playBGMusic();
//createCoin();
//spawnCoin();
setupKeyboardListener();