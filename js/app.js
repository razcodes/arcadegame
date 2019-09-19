// Global variables
let ALLOWED_KEYS;
let LEVEL = 1;
let LIVES = 3;
let SCORE = 0;
let DIFFICULTY = 4;
let SCORE_UPDATE = document.getElementsByClassName("score")[0];

// Creates an empty array of enemies
let allEnemies = [];

// Enemy pictures array
let enemyPics = [
  'alpha.png',
  'phi.png',
  'chi.png',
  'sigma.png',
  'mu.png'
];

// Character pictures Array
let playerPics = [
  'char-boy.png',
  'char-cat-girl.png',
  'char-horn-girl.png',
  'char-pink-girl.png',
  'char-princess-girl.png'
];

// Opening dialog
const body = document.querySelector("body");
const openingDialog = document.createElement("DIV");
openingDialog.classList.add("opening_dialog");
openingDialog.innerHTML = `Choose your character: <br/>
                            <a class="arrow" data-arrow="left">&#8592;</a>
                            <img src="images/${getFirstPlayerPic()}" id="player_pic">
                            <a class="arrow" data-arrow="right">&#8594;</a>
                            <br/><button class="ok_button">OK</button>`;
body.appendChild(openingDialog);
let openingDialogOpen = true; // Flags the opening dialog

// Character selector
const okButton = document.querySelector("button");
body.addEventListener("keyup",function(){
  if(openingDialogOpen){
    if(event.keyCode === 13){
      init();
      // Cancels the option to re-initiate after the opening dialog is closed
      openingDialogOpen = false;
    }
    if(event.keyCode === 39){
      playerPic.src = `images/${getFirstPlayerPic()}`
    }
    if(event.keyCode === 37){
      playerPic.src = `images/${getLastPlayerPic()}`;
    }
  }
});
okButton.addEventListener("mouseup",function(){
  // Initiates game
  init();
});

// Character selection arrows
const leftArrow = document.querySelector('a[data-arrow="left"]');
const rightArrow = document.querySelector('a[data-arrow="right"]');
const playerPic = document.getElementById("player_pic");
leftArrow.classList.add("arrow");
rightArrow.classList.add("arrow");

// Change the picture each time used clicks one of the arrows
leftArrow.addEventListener("click", function(){
  playerPic.src = `images/${getLastPlayerPic()}`;
});
rightArrow.addEventListener("click", function(){
  playerPic.src = `images/${getFirstPlayerPic()}`;
});

class Enemy{
  constructor() {
    this.x = -1;
    this.y = 0.7;
    this.speed = 0.07;
    this.image = `images/${randomObject(enemyPics)}`;
  }

  update(dt) {
    let newSpeed = dt * this.speed;
    this.x += newSpeed;
  }

  render() {
    ctx.drawImage(Resources.get(this.image), this.x*101, this.y*83);
    if(this.x > 6){
      this.y = Math.floor(Math.random() * 3) + 0.75;
      this.x = -1;
      this.speed = Math.ceil(Math.random()*4);
      this.image = `images/${randomObject(enemyPics)}`;
    }
  }
}

class Player {
  constructor() {
    this.x = 2;
    this.y = 3.5;
    this.image = `images/char-boy.png`;
  }
  changeImage(image) {
    this.image = `images/${image}`;
  }
  update(dt) {
  }
  render() {
    ctx.drawImage(Resources.get(this.image), this.x*101, this.y*83);
  }
  handleInput(e) {
    if(e === 13){
      return;
    }
    if(e==='left' && this.x !== 0){
      this.x--;
    }
    else if(e==='right' && this.x !== 4){
      this.x++;
    }
    else if(e==='up' && this.y !== -0.5){
      this.y--;
    }
    else if(e==='down' && this.y !== 4.5){
      this.y++;
    }
    else if(e==='stop'){
      ALLOWED_KEYS[37] = "";
      ALLOWED_KEYS[38] = "";
      ALLOWED_KEYS[39] = "";
      ALLOWED_KEYS[40] = "";
    }
  }
}

// Returns a random value from a given array
function randomObject(array){
  return array[Math.floor(Math.random()*array.length)];
}

// This functions checks if the player has reached the water
function checkWin(){
  // Player reached water
  if(player.y < 0.5){
    addPoint();
    player.x = 2;
    player.y = 3.5;
    // Adds another enemy each time player gets another 10 points
    if(SCORE%10===0){
      levelUp();
      const newEnemy = new Enemy();
      newEnemy.y = Math.floor(Math.random() * 3) + 0.75;
      newEnemy.speed = Math.ceil(Math.random()*4);
      newEnemy.sprite = `images/${randomObject(enemyPics)}`;
      allEnemies.push(newEnemy);

    }
  }
}

function levelUp(){
  LEVEL++;
  const levelHtml = document.getElementById("level");
  let newLevel = levelHtml.innerHTML.substring(0, levelHtml.innerHTML.length-1);
  levelHtml.innerHTML = newLevel+LEVEL;
  levelHtml.classList.add("level");
  levelHtml.classList.replace("level", "level_up");
  setTimeout(function () {
    levelHtml.classList.replace("level_up", "level");
  }, 400);
}

// Adding a point to the score counter
function addPoint(){
  // If the player reaches the water
  SCORE++;
  if(SCORE<=10){
    let newScore = SCORE_UPDATE.innerText.substring(0,SCORE_UPDATE.innerText.length-1);
    SCORE_UPDATE.innerText = newScore + SCORE;
  }
  if(SCORE>10){
    let newScore = SCORE_UPDATE.innerText.substring(0,SCORE_UPDATE.innerText.length-2);
    SCORE_UPDATE.innerText = newScore + SCORE;
  }
  SCORE_UPDATE.classList.add("score");
  SCORE_UPDATE.classList.replace("score", "score_up");
  setTimeout(function () {
    SCORE_UPDATE.classList.replace("score_up", "score");
  }, 200);
}

// Checks if player collides with an enemy
function checkCollisions() {
  // If no lives left - Game Over
  if(LIVES===0){
    GameOver();
  }
  else{
  // Loops through the enemy array and checks for collitions
    allEnemies.forEach(function(enemy) {
      let hitX = Math.abs(enemy.x-player.x);
      let hitY = Math.abs(enemy.y-player.y);
      // If enemy and player are at the same spot they collide
      if(hitX < 0.54 && hitY < 0.3){
        player.x = 2;
        player.y = 3.5;
        if(LIVES>=1){
          removeHeart();
          LIVES--;
        }
      }
    })
  }
}

// Removes a life (out of 3)
function removeHeart(){
  let livesHtml = document.querySelectorAll("img");
  let livesArr = Array.prototype.slice.call(livesHtml);
  let lifeToRemove = livesArr.pop();
  lifeToRemove.parentNode.removeChild(lifeToRemove);
}

// Listens for movement key presses
document.addEventListener('keyup', function(e) {
    player.handleInput(ALLOWED_KEYS[e.keyCode]);
});

// Opens a window with a game over sign and offers a restart
function GameOver(){
  // Background turning greyscale when game is over
  document.querySelector("canvas").classList.add("greyscale");
  // Game over window
  const gameWindow = document.querySelector("body");
  const gameOverWindow = document.createElement("H2");
  gameOverWindow.classList.add('game_over');
  gameOverWindow.innerHTML = "Game Over <br/>";
  if(!document.querySelector("H2")){
    gameWindow.appendChild(gameOverWindow);
    player.handleInput("stop");
  }
  // Restart button
  const restartButton = document.createElement("BUTTON");
  restartButton.classList.add("restart_button");
  restartButton.innerHTML = "Restart";
  gameOverWindow.appendChild(restartButton);
  if(document.querySelector("button")){
    document.querySelector("button").addEventListener("mouseup", function(){
      location.reload();
    });
    let gameOverDialogOpen = true;
    body.addEventListener("keyup", function(){
      if(gameOverDialogOpen && event.keyCode === 13){
        location.reload();
      }
    });
  }
}

// Creates a player
let player = new Player();

// Initiate game function
function init(){
  const selectedChar = getSelectedCharName();
  player.changeImage(selectedChar);
  body.removeChild(openingDialog);
  createEnemies();
  // Initializes rray of keycodes for moving around
  ALLOWED_KEYS = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };
}

// Returns player pic - circulating through the array from the start
function getFirstPlayerPic() {
  let pic = playerPics.shift();
  playerPics.push(pic);
  return pic;
}

// Returns player pic - circulating through the array from the end
function getLastPlayerPic() {
  playerPics.unshift(playerPics.pop());
  let pic = playerPics.pop();
  playerPics.push(pic);
  return pic;
}

// Gets the src name of the file without its path
function getSelectedCharName() {
    var fullPath = document.querySelectorAll("img")[3].src;
    var index = fullPath.lastIndexOf("/");
    var filename = fullPath;
    if(index !== -1) {
        filename = fullPath.substring(index+1,fullPath.length);
    }
    return filename;
}

// Adds 4 enemies to the enemy array
function createEnemies(){
  for(let i = 0; i<DIFFICULTY; i++){
    allEnemies[i] = new Enemy();
    allEnemies[i].y = Math.floor(Math.random() * 3) + 0.75;
    allEnemies[i].speed = Math.ceil(Math.random()*4);
  }
}
