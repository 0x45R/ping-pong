class GameOver extends HTMLElement{
  constructor(data){
    super();
    this.innerHTML = `<h1 class="game-title">${data.result}</h1>   
<img class="game-banner" src="assets/sprites/webp/ping-pong.webp">
    <button>Szybki reset</button>  
    <button onclick='document.querySelector("scene-manager").loadScene("waiting-room")'>Nowa Gra</button>       
    <button onclick='document.querySelector("scene-manager").loadScene("main-menu")'>Menu glowne</button>
    </div>`;
  }
}

window.customElements.define('game-over', GameOver)

