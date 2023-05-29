class GameOver extends HTMLElement{
  constructor(data){
    super();
    // Zdobywa dane przeslane z planszy gry (game-board)
    this.data = data;

    // Znajduje elementy <score-manager> i <scene-manager>, przypisuje je do osobnych zmiennych.
    this.scoreManager = document.querySelector('score-manager');
    this.sceneManager = document.querySelector('scene-manager');

    // Dodaj graczy
    this.scoreManager.addNewPlayer(this.data.result.winner, true);
    this.scoreManager.addNewPlayer(this.data.result.loser, false);
    
    // Zaktualizuj dane, korzystajac z wiadomosci (data.result.message) jako tytul
    this.innerHTML = `
    <h1 class="game-title">${this.data.result.message}</h1>   
    <img class="game-banner" src="assets/sprites/webp/ping-pong.webp">
    <button class='quick-restart'>Szybki reset</button>  
    <button class='new-game'>Nowa gra</button>       
    <button class='main-menu'>Menu główne</button>
    </div>`;

    // Znajdz element o klasie quick-restart i przypisz go do zmiennej
    this.quickRestart = this.querySelector('.quick-restart')
    // Jezeli element zostal klikniety, wtedy zaladuj nowa gre z danymi startowymi poprzedniej (szybki restart)
    this.quickRestart.addEventListener('click',()=>{
      this.sceneManager.loadScene('game-board', this.data.gameData);
    })

    // Znajdz element o klasie new-game i przypisz go do zmiennej
    this.newGame = this.querySelector('.new-game');
    // Jezeli element zostal klikniety, wtedy zaladuj poczekalnie
    this.newGame.addEventListener('click',()=>{
      this.sceneManager.loadScene('waiting-room');
    })
  
    // Znajdz element o klasie main-menu i przypisz go do zmiennej
    this.mainMenu = this.querySelector(".main-menu");
    // Jezeli element zostal klikniety, wtedy zaladuj menu glowne
    this.mainMenu.addEventListener('click',()=>{
      this.sceneManager.loadScene('main-menu');
    })
  }
}

window.customElements.define('game-over', GameOver)

