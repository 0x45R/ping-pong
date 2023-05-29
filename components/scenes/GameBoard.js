// Ukradzione z https://stackoverflow.com/a/11409944
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

class Ball{
  constructor(game, velocity={x:1,y:0}, size={width: 10, height: 10}, speed=10){
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
    // Zmienna 'data' to dane przeslane z poczekalni
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
        <button class="menu-button">Powrót do menu</button>
      </div>
      <canvas id="game-canvas" width="0" height="0">
      </canvas>
    </div>
    <div class="info-bar">
      <div class="info-team left"></div>
      <div class="info-team right"></div>
    </div>`;  

  }
  goal(side){
    let direction = 0;
    if(side>0){
      // Jezeli pilka upadla po stronie lewej to daj punkt prawej stronie i ustaw kierunek pilki w lewo
      this.score.right+=1; 
      direction = -1;
    } else {
      // Jezeli nie to na odwrot
      this.score.left+=1;     
      direction = 1;
    }

    // Ustaw wynik lewej i prawej strony
    this.querySelector(".score.left").innerHTML = this.score.left;
    this.querySelector(".score.right").innerHTML = this.score.right;

    // Jezeli wynik ktorejkolwiek strony jest wiekszy badz rowny 10 to
    if(this.score.left >=10 || this.score.right >=10){
      // Ustal zwyciezce i przegranego
      let winner = this.score.left >=10 ? "left" : "right";
      let loser = this.score.left >=10 ? "right" : "left";
      // Nazwy graczy zapisz do zmiennej
      let joinedTeamNames = this.players[winner].map(element => element.name).join(",")
      // Zapisz wiadomosc z nazwami graczy
      let message = joinedTeamNames + " wygrywa!";
      // Zaladuj scene konca gry z danymi takimi jak: zwyciezca, przegrany, wiadomosc i dane tej rozgrywki
      this.sceneManager.loadScene('game-over', {result: {winner:this.players[winner][0].name,loser:this.players[loser][0].name,message:message}, gameData: this.initialData});
    }

    return direction;
  }
  get paused(){
    return this.hasAttribute('paused');
  }
  set paused(value){
    // Jezeli gra juz jest zatrzymana to nic nie rob
    if(value === this.paused){
      return;
    }
    if(value){   
      // Jezeli gra ma byc zatrzymana to
      Array.from(this.gameOverlay.children).forEach(element => {
        // Wlacz kazdy element (glownie przyciski)
        element.removeAttribute('disabled');
      });
      // Ustaw atrybut tego elementu na 'paused'
      this.setAttribute('paused','');
      // Zmien ikone przycisku pauzy na ikone play wypelniona
      this.pauseButton.innerHTML = '<i class="ti ti-player-play-filled"></i>'
      // Wyczysc wszystkie "interwaly"
      this.clearIntervals();
      // Animuj przez 200ms wyjawianie sie
      this.gameOverlay.animate([{opacity: 0}, {opacity: 1}], {duration: 200, fill: "forwards"});
      // po 200 ms usun klase 'hidden'
      setTimeout(()=>{this.gameOverlay.classList.remove('hidden');}, 200);;
    }else{    
      // Jezeli gra ma byc 'odpauzowana' to
      Array.from(this.gameOverlay.children).forEach(element => {
        // Wylacz kazdy element (glownie przyciski)
        element.setAttribute('disabled','');
      });
      // Zmien ikone przycisku pauzy na ikone pauzy wypelnionej
      this.pauseButton.innerHTML = '<i class="ti ti-player-pause-filled"></i>'
      // Usun atrybut 'paused'
      this.removeAttribute('paused');
      // Ustaw 'interwaly'
      this.setupIntervals();
      // Animuj przez 200ms zanikanie
      this.gameOverlay.animate([{opacity: 1}, {opacity: 0}], {duration: 200, fill: "forwards"});
      // Daj kazdemu elementowi w gameOverlay klase hidden
      setTimeout(()=>{this.gameOverlay.classList.add('hidden');}, 200);
    }
  }

  setupIntervals(){
    // Ustaw by 60 razy na sekunde wywolywana zostawala funkcja tick
    this.tickInterval = setInterval(()=>this.tick(), 1000/60);
    // Oraz co 1 sekunde funkcja clockTick
    this.clockInterval = setInterval(()=>this.clockTick(), 1000);
  }
  getPlayers(){
    // Funkcja ktora ma znalezc i ustalic graczy
    this.allTeams = {left: {}, right:{}};
    this.allTeams.left = document.querySelector(".info-team.left");
    this.allTeams.right = document.querySelector(".info-team.right");

    // Iteruj przez obiekt this.players
    for (const [key, value] of Object.entries(this.players)) {
      let team = key;
      // Chcialem dodac wiecej graczy niz po jednym na druzyne jednak wkoncu sie nie zdecydowalem
      this.players[team].forEach(element => {
        // Stworz paragraf
        let paragraph = document.createElement('p');
        let playerIcon = "";
        // Utworz obiekt paletki gracza z jego ustawieniami sterowania
        let paddleObject = new Paddle(this, team, new PlayerSteer(element.keybinds));
        if(element.type == 0){
          // Jezeli gracz jest czlowiekiem to tylko zmien jego ikone na ikone user-circle
          playerIcon = '<i class="ti ti-user-circle"></i>';
        }else{
          // Jezeli nie jest czlowiekiem to zmien jego ikone na cpu oraz jego sterowanie na nowa instancje AISteer
          playerIcon = '<i class="ti ti-cpu"></i>'; 
          paddleObject.steer = new AISteer();
        }
        // Ustaw zawartosc paragrafu na ikone gracza i nazwe
        paragraph.innerHTML = `${playerIcon} ${element.name}`;
        // Dodaj paletke gracza do obiektow gry
        this.objects.push(paddleObject)
        // Dodaj druzyne do reszty druzyn
        this.allTeams[team].appendChild(paragraph)
      });
    }
  }
  clearIntervals(){
    // Usuwa 'interwaly'
    clearInterval(this.tickInterval);
    clearInterval(this.clockInterval);
  }
  disconnectedCallback(){
    // Gdy element jest usuniety, ustaw score na 0 i usun 'interwaly'
    this.score = 0;
    this.clearIntervals();
  }
  pauseButtonClicked(){
    // Jezeli przycisk pauzy zostal klikniety to zmien zmienna pauza na przeciwna
    this.paused = !this.paused
  }
  connectedCallback(){
    this.sceneManager = document.querySelector("scene-manager");
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.gameClock = document.getElementById('game-clock');
    this.canvasContainer = this.querySelector('.canvas-container');
    
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
    // Z kazda sekunda zmieniaj zegar
    let date = new Date().getTime();
    this.gameTime = (date - this.startTime) / 1000;
    let seconds = new String(Math.round(this.gameTime) % 60).padStart(2, "0");
    let minutes = new String(Math.floor(this.gameTime / 60)).padStart(2, "0");

    this.gameClock.innerHTML = `${minutes}:${seconds}`;
  }


  tick(){
    // Kazde 60 razy na sekunde 
    // Ustaw wielkosc elementu canvas na wielkosc elementu canvasContainer
    this.canvas.width = this.canvasContainer.clientWidth;
    this.canvas.height = this.canvasContainer.clientHeight;
    // Iteruj przez tablice objects, za kazdym razem wywolujac funkcje rysowania z argumentem ctx
    this.objects.forEach(obj => {
      obj.draw(this.ctx);
    });


  }
}

window.customElements.define('game-board', GameBoard); 

