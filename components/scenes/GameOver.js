class GameOver extends HTMLElement{
  constructor(data){
    super();
    this.data = data;
    this.sceneManager = document.querySelector('scene-manager')
    this.innerHTML = `<h1 class="game-title">${this.data.result}</h1>   
<img class="game-banner" src="assets/sprites/webp/ping-pong.webp">
    <button id='quick-restart'>Szybki reset</button>  
    <button onclick='document.querySelector("scene-manager").loadScene("waiting-room")'>Nowa Gra</button>       
    <button onclick='document.querySelector("scene-manager").loadScene("main-menu")'>Menu glowne</button>
    </div>`;
    this.querySelector('#quick-restart').addEventListener('click',()=>{this.sceneManager.loadScene('game-board', this.data.gameData)})
  }
}

window.customElements.define('game-over', GameOver)

