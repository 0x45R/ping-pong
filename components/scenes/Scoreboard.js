class Scoreboard extends HTMLElement {
  constructor(){
    super();
    this.content = "";
  }
  connectedCallback(){
    // Znajduje element <score-manager> zajmujacy sie wynikiem
    this.scoreManager = document.querySelector('score-manager');
    // Wywoluje funkcje updateContent, ktora wybiera dane z <score-manager> i przedstawia je w tablicy
    this.updateContent();
  }
  updateContent(){
    for (const [key, value] of Object.entries(this.scoreManager.getRecords())) {
      // Przetwarza zmienna wartosc pod zmienna obj
      let obj = JSON.parse(value);
      obj.name = key;
      // Wiersz tabeli
      let current_tag = `
      <tr>
      <td>${obj.name}</td>
      <td>${obj.wins}</td>
      <td>${obj.games}</td>
      <td>${Math.round(obj.wins/obj.games*1000)/10}%</td>
      </tr>`;
      this.content += current_tag; // Dodaje wiersz do tabeli
    }
    this.innerHTML = `
    <h1 class="game-title">Tabela wyników</h1>
    <img class="game-banner" src="assets/sprites/svg/trophy.svg">
    <div class="scoreboard-container">
    <table>
      <thead>
        <td>Imię</td>
        <td>Wygrane</td>
        <td>Rozegrane</td>
        <td>Procent wygranych</td>
      </thead>
      <tbody>
        ${this.content}
      </tbody>
      </table>
    </div>
    <button class="back-to-menu" onclick='document.querySelector("scene-manager").loadScene("main-menu")'><i class="ti ti-arrow-back"></i></button>
    </div>`;
    }
}


window.customElements.define('score-board', Scoreboard); 
