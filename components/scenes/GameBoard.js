
// Ukradzione z https://stackoverflow.com/a/11409944
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};


class Ball{
  constructor(game, position={x: 0, y: 0}, velocity={x:1,y:0}, size={width: 10, height: 10}, speed=10){
    this.game = game;
    this.size = size;
    this.speed = speed;
    this.velocity = velocity;
    this.position = this.center(this.game.ctx);
    this.collider = Collider.newFromObject(this);
    this.audioManager = document.querySelector('audio-manager');
  }
  center(ctx){
     return {x:ctx.canvas.width/2+this.size.width/2, y:ctx.canvas.height/2-this.size.height/2};
  }

  ballBounce(collider){
    this.audioManager.playPaddleSound();
    this.velocity.x *= -1;
    this.velocity.y = -collider.velocity.y*0.1+Math.random();
  }

  checkCollision(ctx){
    this.game.objects.forEach(element => {
      if(!(element instanceof Ball)){
        if(element.collider !== null){
          element.collider.collidesWith(this.collider, (collider)=>this.ballBounce(collider));
        }
      }
    });

    if(this.position.x+this.size.width> ctx.canvas.width || this.position.x+this.size.width< 0){
      let goal = this.game.goal(+(this.position.x < 0));

      this.position = this.center(ctx);
      this.velocity.x = 0;
      this.velocity.y = 0;
      this.audioManager.playGoalSound();

      setTimeout(()=>{this.velocity.x = goal;this.audioManager.playBallLaunchSound();},2500)
    }
    if(this.position.y> ctx.canvas.height || this.position.y-this.size.height< 0){
      this.velocity.y *= -1;
      this.audioManager.playPaddleSound();
    }
  }
  draw(ctx){
    this.speed += 1/6000;
     
    this.collider.position = this.position;
    this.collider.velocity = this.velocity;
    this.checkCollision(ctx);

    this.position.x += this.velocity.x*this.speed;
    this.position.y += this.velocity.y*this.speed;
   
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.position.x,this.position.y, this.size.width, 0, Math.PI * 2)
    ctx.fill();
  }

}
class AISteer{
  tick(paddle, ctx){
    let ball = paddle.game.objects.filter(element=>element instanceof Ball)[0];
    paddle.velocity.x = 0;
    if(Math.ceil(paddle.position.y/10)*10 == Math.ceil((ball.position.y-paddle.size.height/2)/10)*10){
      paddle.velocity.y = 0;
    }
    else if(paddle.position.y > ball.position.y - paddle.size.height/2){
      paddle.velocity.y = -1 * paddle.speed;
    }
    else if(paddle.position.y < ball.position.y - paddle.size.height/2){
      paddle.velocity.y = 1 * paddle.speed;
    }
  }
}

class PlayerSteer{
  constructor(keybinds={"up":"ArrowUp", "down":"ArrowDown"}){
    this.keyBuffer = [];
    this.keybinds = keybinds;
    window.addEventListener("keydown", (event)=>this.addToBuffer(event.key));
    window.addEventListener("keyup", (event)=>this.removeFromBuffer(event.key));
  }
  tick(paddle, ctx){
    paddle.velocity.x = 0;
    paddle.velocity.y = 0;
    if(this.keyPressed(this.keybinds.down)) paddle.velocity.y = 1 * paddle.speed;
    if(this.keyPressed(this.keybinds.up)) paddle.velocity.y = -1 * paddle.speed;

    
  }

  keyPressed(key){
    return this.keyBuffer.includes(key)
  }

  addToBuffer(key){
    if(!this.keyBuffer.includes(key)){
      this.keyBuffer.push(key)
    }
  }
  removeFromBuffer(key){
    if(this.keyBuffer.includes(key)){
      let index = this.keyBuffer.indexOf(key)-1;
      this.keyBuffer = this.keyBuffer.filter((elem, elem_index)=>elem_index == index)
    }
  }
}

class Line{
  constructor(game){
    this.game = game;
    this.collider = null;
  }
  draw(ctx){
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(ctx.canvas.width/2, 0);
    ctx.lineTo(ctx.canvas.width/2, ctx.canvas.height);
    ctx.stroke();
  }
}

class Collider{
  constructor(position = {x: 0, y: 0}, size = {width: 100, height: 50}, velocity = {x: 0, y:0}){
    this.position = position;
    this.size = size;
    this.velocity = velocity;
  }

  collidesWith(collider, callback){
    if(
      this.position.x < collider.position.x + collider.size.width &&
      this.position.x + this.size.width > collider.position.x &&
      this.position.y < collider.position.y + collider.size.height &&
      this.size.height + this.position.y > collider.position.y
    ){
      callback(this);
    }
  }
  static newFromObject(object){
    return new Collider(object.position, object.size, object.velocity);
  }
}

class Paddle{
  constructor(game, side= "left",  steer = new PlayerSteer(), position = {x: 0, y: 0}, padding = {x:0.04}, size = {width: 10, height: 100}, speed=10, velocity={x:0,y:0}){
    this.game = game;
    this.size = size;
    this.side = side;
    this.speed = speed;
    this.steer = steer;
    this.position =position;  // Add custom setter and getter to position that doesn't allow this to go out of bounds
    this.collider = Collider.newFromObject(this);
    this.velocity = velocity;
    this.padding = padding;
  }

  draw(ctx){
    this.steer.tick(this, ctx);
    this.position.y += this.velocity.y;
    this.position.y = this.position.y.clamp(0, this.game.canvas.height-this.size.height);
    let padding = ctx.canvas.width*this.padding.x;
    ctx.fillStyle = "white";
    ctx.beginPath();
    if(this.side == "left"){
      this.position.x = padding;
      ctx.roundRect(this.position.x, this.position.y, this.size.width, this.size.height, 100);
    }else{
      this.position.x = ctx.canvas.width-padding;
      ctx.roundRect(this.position.x, this.position.y, this.size.width, this.size.height, 100);
    }
    this.collider.position = this.position;
    this.collider.velocity = this.velocity;
    ctx.fill();
  }
}

class GameBoard extends HTMLElement {
 constructor(data){
   super();
    this.initialData = data;
    this.players = data.players;
   this.innerHTML = `

<div class="info-bar">
   <div class="info">
      <button class="pause-button">
        <i class="ti ti-player-pause-filled"></i>
      </button>

     <p class="score left">0</p>
     <p id="game-clock">00:00</p>
     <p class="score right">0</p>
   </div>
 </div>
<div class="canvas-container">
<div class="game-overlay">
<p class="game-title">Pauza</p>
<button class="restart-button">Restart</button>
<button class="menu-button">Powrot do menu</button>
</div>
 <canvas id="game-canvas">
 </canvas>
</div>
 <div class="info-bar">
   <div class="info-team left"></div>
   <div class="info-team right"></div>
 </div>
`;  

  }
  goal(side){
    let direction = 0;
    if(side>0){
      this.score.right+=1; 
      direction = -1;
    } else {
      this.score.left+=1;     
      direction = 1;
    }
    this.querySelector(".score.left").innerHTML = this.score.left;
    this.querySelector(".score.right").innerHTML = this.score.right;

    if(this.score.left >=10 || this.score.right >=10){
      let winner = this.score.left >=10 ? "left" : "right";
      let joinedTeamNames = this.players[winner].map(element => element.name).join(",")
      let message = joinedTeamNames + " wygrywa!";
      this.sceneManager.loadScene('game-over', {result:  message, gameData: this.initialData});
    }

    return direction;
  }
  get paused(){
    return this.hasAttribute('paused');
  }
  set paused(value){
    if(value === this.paused){
      return;
    }
    if(value){
      Array.from(this.gameOverlay.children).forEach(element => {
        element.removeAttribute('disabled');
      });
      this.setAttribute('paused','');
      this.pauseButton.innerHTML = '<i class="ti ti-player-play-filled"></i>'
      this.clearIntervals();
 //     this.gameOverlay.classList.add('hidden');
      this.gameOverlay.animate([{opacity: 0}, {opacity: 1}], {duration: 200, fill: "forwards"})     
      setTimeout(()=>{this.gameOverlay.classList.remove('hidden');}, 200);
    }else{    
      Array.from(this.gameOverlay.children).forEach(element => {
        element.setAttribute('disabled','');
      });
      this.pauseButton.innerHTML = '<i class="ti ti-player-pause-filled"></i>'
      this.removeAttribute('paused');
      this.setupIntervals();    
      this.gameOverlay.animate([{opacity: 1}, {opacity: 0}], {duration: 200, fill: "forwards"});
      setTimeout(()=>{this.gameOverlay.classList.add('hidden');}, 200);
    }
  }

  setupIntervals(){
    this.tickInterval = setInterval(()=>this.tick(), 1000/60);
    this.clockInterval = setInterval(()=>this.clockTick(), 1000);
  }
  getPlayers(){
    console.log(this.players)
    this.allTeams = {left: {}, right:{}}
    this.allTeams.left = document.querySelector(".info-team.left");
    this.allTeams.right = document.querySelector(".info-team.right");

    for (const [key, value] of Object.entries(this.players)) {
      let team = key;
      this.players[team].forEach(element => {
        let paragraph = document.createElement('p');
        let playerIcon = "";
        let paddleObject = new Paddle(this, team, new PlayerSteer(element.keybinds)); // add controls
        if(element.type == 0){
          playerIcon = '<i class="ti ti-user-circle"></i>';
        }else{
          playerIcon = '<i class="ti ti-cpu"></i>'; 
          paddleObject.steer = new AISteer();
        }
        paragraph.innerHTML = `${playerIcon} ${element.name}`;
        this.objects.push(paddleObject)
        this.allTeams[team].appendChild(paragraph)
      });
    }
  
    //his.querySelector("#left-player-name").innerHTML = '' + this.players.left.name;
    //this.querySelector("#right-player-name").innerHTML = '<i class="ti ti-cpu"></i>' + this.players.right.name;


  }
  clearIntervals(){
    clearInterval(this.tickInterval);
    clearInterval(this.clockInterval);
  }
  disconnectedCallback(){
    this.score = 0;
    this.clearIntervals();
  }
  pauseButtonClicked(){
    this.paused = !this.paused
  }
  connectedCallback(){
    this.sceneManager = document.querySelector("scene-manager");
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.gameClock = document.getElementById('game-clock');
    
    this.pauseButton = this.querySelector(".pause-button");
    this.pauseButton.addEventListener('click',()=>this.pauseButtonClicked());
    window.addEventListener('blur',()=>this.paused=true);

    this.gameOverlay = this.querySelector(".game-overlay");
    this.restartButton = this.querySelector('.restart-button');
    this.mainMenuButton = this.querySelector('.menu-button');

    this.restartButton.addEventListener('click',()=>this.sceneManager.loadScene("game-board", this.initialData));
    this.mainMenuButton.addEventListener('click',()=>this.sceneManager.loadScene("main-menu"))

    this.startTime = new Date().getTime();
    this.gameTime = 0;

    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.objects = [];
    
    this.setupIntervals();
    this.getPlayers();

    this.objects.push(new Ball(this));
    this.objects.push(new Line(this));
    this.score = {left: 0, right: 0}
  }

  clockTick(){
    let date = new Date().getTime();
    this.gameTime = (date - this.startTime) / 1000;
    let seconds = new String(Math.round(this.gameTime) % 60).padStart(2, "0");
    let minutes = new String(Math.floor(this.gameTime / 60)).padStart(2, "0");

    this.gameClock.innerHTML = `${minutes}:${seconds}`;
  }


  tick(){
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.objects.forEach(obj => {
      obj.draw(this.ctx);
    });


  }
}

window.customElements.define('game-board', GameBoard); 

