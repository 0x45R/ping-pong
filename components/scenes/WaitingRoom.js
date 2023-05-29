const PlayerType = {
  Player: 0,
  AI: 1
}

class PlayerKeybind extends HTMLElement{
  constructor(){
    super();
  }
  get inUse(){
    return this.hasAttribute('in-use');
  }
  set inUse(value){
    if(value){
      this.setAttribute('in-use','');
    }else{
      this.removeAttribute('in-use');
    }
  }
  getKeybindIcon(){
    // Jezeli gracz wybral strzalke w dol lub gore to pokaz ich ikony
    if(this.keybind == "ArrowDown"){
      return '<i class="ti ti-arrow-big-down-filled"></i>'
    }
    if(this.keybind == "ArrowUp"){
      return '<i class="ti ti-arrow-big-up-filled"></i>'
    }
    return this.keybind;
  }
  listenForKeypresses(e){
    // Jezeli gracz kliknal przycisk
    if(this.inUse){
      // Ustaw wybor gracza
      this.keybind = e.key;
      // Zaktualizuj 
      this.update();
      // 'odkliknij' 
      this.inUse = false;
    }
  }
  connectedCallback(){
    // Wybor gracza
    this.keybind = this.getAttribute("default-keybind") || "ArrowDown";
    // Status klikniecia
    this.inUse = false; 
    // Typ przycisku (gora, dol)
    this.type = this.getAttribute('type');
    // Kiedy kliknieto ten element wtedy zmien wartosc inUse
    this.addEventListener('click', (e)=>this.inUse=!this.inUse);
    // Kiedy przycisk zostal wcisniety wtedy wywyolaj funkcje listenForKeypresses
    window.addEventListener('keydown',(e)=>this.listenForKeypresses(e));
    // Zaktualizuj
    this.update();
  }
  update(){
    // Ikona klawisza to wynik funkcji getKeybindIcon
    this.keybindIcon = this.getKeybindIcon();
    // Zaktualizuj zawartosc
    this.innerHTML = `${this.keybindIcon}`;  
  }
}
window.customElements.define('player-keybind', PlayerKeybind);

class PlayerPanel extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback(){
    // Ustal typ gracza (gracz homo sapiens, czy komputer)
    this.playerType = PlayerType[this.getAttribute('player-type')];
    // Ustal nazwe tego gracza
    this.playerName = this.getDefaultPlayerName();
    // Zaktualizuj zawartosc
    this.updateContent();
  }
  changePlayerType(){
    // Funkcja zmienia typ gracza
    
    // Zmien typ gracza na odwrotny
    this.playerType = !this.playerType;
    // Nazwa gracza to wynik funkcji getDefaultPlayerName
    this.playerName = this.getDefaultPlayerName();
    // Zaktualizuj zawartosc
    this.updateContent();
  }
  setPlayerName(e){
    let value = e.target.value
    // Ustaw nazwe gracza na wartosc pola tekstowego
    this.playerName = value;
  }
  getDefaultPlayerName(){
    // Jezeli gracz jest czlowiekiem, zwroc 'gracz', jezeli nie zwroc 'komputer'
    if(this.playerType == PlayerType.Player){
      return "Gracz";
    }else{
      return "Komputer";
    }
  }
  updateContent(){
    // Jezeli gracz jest czlowiekiem to
    if(this.playerType == PlayerType.Player){
      // Pokaz ikone uzytkownika, pole tekstowe i przyciski wyboru przycisku (maslo maslane), pokaz inna wskazowke
      this.innerHTML = `
        <button class="player-type-button">
        <img src="assets/sprites/svg/user.svg" class="player-avatar"></button>
        <div class="player-settings">
         <input placeholder="Gracz" class="player-name left">       
          <div class="player-keybinds">
            <player-keybind type='up' default-keybind='ArrowUp'></player-keybind>             
            <player-keybind type='down'></player-keybind>
          </div>
        </div>
        <p class="hint">^ Tutaj wpisz swoje imię by pojawiło się w tabeli wyników, lub kliknij na ikonę żeby zagrać z komputerem</p>`;

      // Znajdz element o klasie player-name i przypisz go do zmiennej
      this.playerInput = this.querySelector(".player-name");
      // Kiedy gracz wpisze cos do tego pola tekstowego, wywolaj funkcje setPlayerName
      this.playerInput.addEventListener('change',(e)=>this.setPlayerName(e));

    // Jezeli gracz nie jest czlowiekiem (jest komputerem)
    }else{
      // Pokaz ikone CPU stworz tylko paragraf z nazwa 'komputer' (nie pole edycyjne' i pokaz inna wskazowke
      this.innerHTML = `
      <button class="player-type-button"><img src="assets/sprites/svg/cpu.svg" class="player-avatar"></button>
      <div class="player-settings">
      <h3 class="player-name right">Komputer</h3>
      </div>
      <p class="hint">^ Kliknij na ikone żeby zagrac z graczem</p>`;
    }
    // Jezeli uzytkownik kliknal ikone wtedy zmien typ gracza
    this.querySelector('.player-type-button').addEventListener('click',()=>this.changePlayerType());
    // Znajdz wszystkie elementy player-keybind i przypisz je do zmiennej jako tablica
    this.playerKeybinds = this.querySelectorAll('player-keybind');
  }
}
window.customElements.define('player-panel', PlayerPanel); 

class WaitingRoom extends HTMLElement {
  constructor(){
    super();
    this.innerHTML = `
    <h1 class="game-title">Poczekalnia</h1>
    <div class="player-select">
      <div class="team left">
        <player-panel player-type="Player"></player-panel>
      </div>
      <div class="vertical-line"></div>
      <div class="team right">
        <player-panel player-type="AI"></player-panel>
      </div>
    </div>
    <button class="start-button">Start</button>
    <button class="back-to-menu">
      <i class="ti ti-arrow-back"></i>
    </button>`;
  }
  connectedCallback(){
    // Znajdz element scene-manager i przypisz go do zmiennej
    this.sceneManager = document.querySelector("scene-manager");
    // Znajdz wszystkie elementy o klasie team i przypisz je do tablicy
    this.allTeams = document.querySelectorAll('.team');

    // Znajdz element o klasie start-button i przypisz go do zmiennej
    this.startButton = this.querySelector(".start-button");
    // Jezeli zostanie klikniety, zacznij gre poprzez wywolanie funkcji start
    this.startButton.addEventListener('click', ()=>{this.start()}); 
   
    // Znajdz element o klasie back-to-menu i przypisz go do zmiennej
    this.backToMenu = this.querySelector('.back-to-menu');
    // Jezeli zostanie klikniety, zaladuj menu glowne
    this.backToMenu.addEventListener('click', ()=>{this.sceneManager.loadScene('main-menu')})
  }
  start(){
    // Utworz obiekt players z lewa druzyna i prawa druzyna
    this.players = {left:[],right:[]};
    // Iteruj przez wszystkie elementy o klasie team
    this.allTeams.forEach(element => {
      // Zdobadz ich klase jako tablice
      let class_array  = Array.from(element.classList);
      // Zdobadz ich dzieci jako tablice
      let children_array = Array.from(element.children);
      // Zmienna druzyna rowna klasie bez "team"
      let team = class_array.pop("team");
      // Iteruj przez dzieci elementu
      children_array.forEach(player => {
        // Poczatkowo mialem plan dodac wiecej niz 1 gracza na druzyne, ale nie starczylo mi czasu

        // Ustaw zmienna keybinds jako kontrolki gracza
        let keybinds = Array.from(player.playerKeybinds).map(element=>{
          let keyobject = new Object();
          keyobject[element.type] = element.keybind
          return keyobject
        });
        keybinds = {...keybinds[1], ...keybinds[0]};
        // Dodaj gracza do druzyny 
        this.players[team].push({name:player.playerName, type:player.playerType, keybinds:keybinds})
      
      });
    });
    // Zaladuj scene planszy gry z graczami
    this.sceneManager.loadScene('game-board',{players:this.players});
  }
}

window.customElements.define('waiting-room', WaitingRoom); 

