class MainMenu extends HTMLElement {
 constructor(){
   super();
   this.innerHTML = `  <h1 class="game-title">Ping Pong</h1>
  <img class="game-banner" src="assets/sprites/webp/ping-pong.webp">
  <button onclick='document.querySelector("scene-manager").loadScene("waiting-room")'>Graj</button>       
  <button>Tabela wynikow</button>
  <button>Ustawienia</button>
  </div>`;
 }
}

window.customElements.define('main-menu', MainMenu); 

