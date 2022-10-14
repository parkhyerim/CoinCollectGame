// Canvas Setup
let canvas;
let ctx;
canvas = document.getElementById('mainCanvas');
ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Game 
let player;
let playerImage, coinImage, enemyImage, laserbeamImage, gameOverImage; 
let score = 0;
let health = 5;
let playerSpeed = 6;
let laserSpeed = 7;
let enemySpeed = 2;
let gameOver = false;  
let gameStart = false;

// Sound
const bgMusicSound = new sound('audio/gamemusic1.mp3');
const coinSound = new sound('audio/coin.wav');
const collectSound = new sound('audio/coin.wav');
const collisionSound = new sound('audio/crash.mp3');
const laserbeamSound = new sound('audio/laserbeam.wav');
const gameoverSound = new sound('audio/gameover.wav');

function sound(src){
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// Player
const playerImgLength = 64;
let playerXPos = canvas.width/2 - playerImgLength/2;    // The player's x position - in the center of the game area
let playerYPos = canvas.height + playerImgLength;   // The player's y position - on the bottom
class Player{
    constructor(){
        this.x =  canvas.width/2 - playerImgLength/2; 
        this.y = canvas.height + playerImgLength; 
        this.speed = playerSpeed;
        this.canMove = true;
    }
}

// Coin
let coinArray = [];
let coinExist = false;
class Coin {
    constructor(){
        this.x = generateRandomValue(130, canvas.width - coinImage.imgWidth); // to make the game UI for score&health visiable
        this.y = generateRandomValue(80, canvas.height - coinImage.imgHeight);
       /*
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 440/10;
        this.spriteHeight = 40;
        */
    }
}

//Enemy(Bomb)
let enemyArray = [];
//let enemyImageLength = 64;
class Enemy {
    constructor(){
        this.x = generateRandomValue(0, canvas.width - enemyImage.imgWidth);
        this.y = 0;
    }
    update(){
        this.y += enemySpeed;
    }
}

// Laser beam
let laserArray = [];
//let laserImgLength = 64;
class LaserBeam {
    constructor(){
        this.x = playerXPos;
        this.y = playerYPos;
        this.canUse = false;
        laserArray.push(this);
    }
    
    update(){
        this.y -= laserSpeed;
    }

    checkHit(){
        for(let i=0; i < enemyArray.length; i++){
            if(Math.abs(this.x - enemyArray[i].x) < enemyImage.imgWidth/2 &&
                Math.abs(this.y - enemyArray[i].y) < enemyImage.imgHeight/2){
                  //  console.log("hit enemy");
                    enemyArray.splice(i,1);
                    health++;
            }
        }
    }
}

function spawnCoin(){
    if(coinArray.length < 1){
        if(!coinExist){
            coinExist = true;
            // new coin is generated after 1 second
            setTimeout(() => {  
                coinArray.push(new Coin()); 
            }, 1000); 
        }
    } 
}

function collectCoin(){
    for(let i=0; i < coinArray.length; i++){
        if(Math.abs(coinArray[i].x - playerXPos) <= coinImage.imgWidth-10 
        && Math.abs(coinArray[i].y - playerYPos) <= coinImage.imgHeight-10){
            collectSound.play();
            coinArray.splice(i, 1);
            coinExist = false;
            score++;        
        }
    }
}

function checkBombHit(){
    for(let i=0; i< enemyArray.length; i++){
        if(Math.abs(enemyArray[i].y - playerYPos) < enemyImage.imgWidth -10 
        && Math.abs(enemyArray[i].x- playerXPos) < enemyImage.imgHeight -10){
            collisionSound.play();
            enemyArray.splice(i,1);
            health -=2;       
        }else if(enemyArray[i].y >= canvas.height - enemyImage.imgHeight){  // If bomb touches the ground, the score -1
            collisionSound.play();
            enemyArray.splice(i,1);
            health--;
        }
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

// Keyboard Interaction
const leftKey = 37;
const rightKey = 39;
const upKey = 38;
const downKey = 40;
const spaceBar = 32;
const wKey = 87;
const aKey = 65;
const dKey = 68;
const sKey = 83;
let keysDown = {};

function setupKeyboardListener(){
    document.addEventListener('keydown', function(event){
        keysDown[event.keyCode] = true;
        //console.log('which key: ', keysDown);
    } );
    document.addEventListener('keyup', function(event){
        delete keysDown[event.keyCode];
        //console.log('which key:', keysDown);

    if(event.keyCode == spaceBar){
        shootLaserBeam();
    } 
    });    
}

function shootLaserBeam(){
    laserArray.push(new LaserBeam());
    laserbeamSound.play();
}

function generateEnemy(){
    let randomInverval = generateRandomValue(1000, 3000);
    setInterval(function(){
        if(gameStart){
            enemyArray.push(new Enemy());
        }
    }, randomInverval);
}
    
function update(){
    // Keyboard controll - the movement of the player
    if(leftKey in keysDown || aKey in keysDown){ // the left arrow key or the 'a' key: to the right
        playerXPos -= playerSpeed;
    } 
    if (rightKey in keysDown || dKey in keysDown){ // the right arrow key or the 'd' key: to the left
        playerXPos += playerSpeed;
    }
    if(upKey in keysDown || wKey in keysDown){ // the upkey or the 'w' key: upwards
        playerYPos -= playerSpeed;
    }
    if(downKey in keysDown || sKey in keysDown){ // the down key or the 's' key: downwards
        playerYPos += playerSpeed;
    }

    //Ensure that the player stays inside the game area only.
    if(playerXPos <= 0){ 
        playerXPos = 0;
    }
    if(playerXPos >= canvas.width - playerImgLength){
        playerXPos = canvas.width -playerImgLength ;
    }
    if(playerYPos <= 0){
        playerYPos = 0;
    }
    if(playerYPos > canvas.height - playerImgLength){
        playerYPos = canvas.height - playerImgLength;
    }

    // Laserbeam update
    for(let i = 0; i < laserArray.length; i++){
        if(laserArray[i]){
            laserArray[i].update();
            laserArray[i].checkHit();
        }
    }

     // Enenmy update - movement
    for(let i=0; i < enemyArray.length; i++){
        enemyArray[i].update();
    }

    // Repeated check the game state - coin spawning, player hit the bomb, health
    spawnCoin();
    collectCoin();
    checkBombHit();   
    checkHealth();     
}

function render(){
    ctx.clearRect(0,0, canvas.width, canvas.height);    // canvas rendering
    ctx.drawImage(playerImage.img,playerXPos,playerYPos); // player rendering
    // gameUI rendering
    if(gameStart){  
        ctx.fillText(`Score: ${score}`, 20, 40);
        ctx.fillText(`Health: ${health}`, 20, 80);
    }
    ctx.fillStyle = 'black'; 
    ctx.font = '30px Arial';

    if(gameStart){
       // console.log("game start render");
            // enemy rendering
    for(let i = 0; i< enemyArray.length; i++){
        ctx.drawImage(enemyImage.img, enemyArray[i].x, enemyArray[i].y);
    }

    // coin rendering
    for(let i = 0; i< coinArray.length; i++){
        ctx.drawImage(coinImage.img, coinArray[i].x, coinArray[i].y);
    }

    // laserBeam rendering
    for(let i = 0; i< laserArray.length; i++){
        ctx.drawImage(laserbeamImage.img, laserArray[i].x, laserArray[i].y);
    }
    }
}

function main(){
    if(!gameOver){
        if(gameStart){
            update();
        }     
        render();
        requestAnimationFrame(main); //  update animation before the next repaint - create loop
    }else{  // the game is over
        ctx.drawImage(gameOverImage.img, canvas.width/2-gameOverImage.imgWidth/2, canvas.height/2-gameOverImage.imgHeight/2, gameOverImage.imgWidth, gameOverImage.imgHeight);  // show the gameover message
        bgMusicSound.stop();
        gameoverSound.play();
    }  
}

function loadImage(){
    playerImage = new image('img/player.png', 64, 64);
    coinImage = new image( 'img/coin.png', 64, 64);
    enemyImage = new image( 'img/enemy.png', 64, 64);
    laserbeamImage = new image( 'img/weapon.png', 64,64);
    gameOverImage = new image('img/gameover.jpg', 400, 211);
}

function image(src, imgWidth, imgHeight){
    this.img = new Image();
    this.img.src = src;
    this.imgWidth = imgWidth;
    this.imgHeight = imgHeight;
}

function sound(src){
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// Player clicked the start button
function startGame(){
    if(!gameStart){
        gameStart = true;   
        let btn = document.getElementById('startBtn');
        btn.disabled = true;
        btn.innerText = "Playing";
        btn.style.backgroundColor = '#C5C5C5'; // grey color
        bgMusicSound.play();
        
    }
}

// Initiate the game
function initiateGame(){
    player = new Player();
}

loadImage();
main();
generateEnemy();
setupKeyboardListener();