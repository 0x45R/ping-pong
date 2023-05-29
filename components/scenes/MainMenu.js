class MainMenu extends HTMLElement {
 constructor(){
    super();
    this.innerHTML = `
    <h1 class="game-title">Ping Pong</h1>
    <img class="game-banner" src="assets/sprites/webp/ping-pong.webp">
    <button class="play-button">Graj</button>       
    <button class="scoreboard-button">Tabela wyników</button>`;

    // Znajduje element <scene-manager> zajmujacy sie ladowaniem scen
    this.sceneManager = document.querySelector('scene-manager');

    // Dodaje przyciskom funckje ladowania scen
    this.playButton = this.querySelector('.play-button');
    // Poczekalnia
    this.playButton.addEventListener('click', ()=>this.sceneManager.loadScene('waiting-room'));

    this.scoreboardButton = this.querySelector('.scoreboard-button');
    // Tabela wynikow
    this.scoreboardButton.addEventListener('click', ()=>this.sceneManager.loadScene('score-board'));

 }
}

window.customElements.define('main-menu', MainMenu); 

