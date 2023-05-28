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
    if(this.keybind == "ArrowDown"){
      return '<i class="ti ti-arrow-big-down-filled"></i>'
    }
    if(this.keybind == "ArrowUp"){
      return '<i class="ti ti-arrow-big-up-filled"></i>'
    }
    return this.keybind;
  }
  listenForKeypresses(e){
    if(this.inUse){
      this.keybind = e.key;
      this.update();
      this.inUse = false;
    }
  }
  connectedCallback(){
    this.keybind = this.getAttribute("default-keybind") || "ArrowDown";
    this.inUse = false;   
    this.type = this.getAttribute('type');
    this.addEventListener('click', (e)=>{console.log(this.inUse);this.inUse=!this.inUse});
    window.addEventListener('keydown',(e)=>this.listenForKeypresses(e));
    this.update();
  }
  update(){
    this.keybindIcon = this.getKeybindIcon();
    this.updateContent();
  }

  updateContent(){
    this.innerHTML = `${this.keybindIcon}`;
  }
}
window.customElements.define('player-keybind', PlayerKeybind); 
class PlayerPanel extends HTMLElement{
  constructor(){
    super();
  }
  connectedCallback(){
    this.playerType = PlayerType[this.getAttribute('player-type')];
    this.playerName = this.getDefaultPlayerName();
    this.updateContent();
  }
  changePlayerType(){
    this.playerType = !this.playerType;
    this.playerName = this.getDefaultPlayerName();
    this.updateContent();
  }
  setPlayerName(e){
    let value = e.target.value
    this.playerName = value;
  }
  getDefaultPlayerName(){
    if(this.playerType == PlayerType.Player){
      return "Gracz";
    }else{
      return "Komputer";
    }
  }
  updateContent(){
    if(this.playerType == PlayerType.Player){
      this.innerHTML = `<button class="player-type-button">
        <img src="assets/sprites/svg/user.svg" class="player-avatar"></button>
          <div class="player-settings">
           <input placeholder="Gracz" class="player-name left">       
            <div class="player-keybinds">
              <player-keybind type='up' default-keybind='ArrowUp'></player-keybind>             
              <player-keybind type='down'></player-keybind>
            </div>
          </div>
          <p class="hint">^ Tutaj wpisz swoje imie by pojawilo sie w tabeli wynikow, lub kliknij na ikone zeby zagrac z komputerem</p>`;
      this.querySelector(".player-name").addEventListener('change',(e)=>this.setPlayerName(e))


    }else{
      this.innerHTML =  `<button class="player-type-button"><img src="assets/sprites/svg/cpu.svg" class="player-avatar"></button>
            <div class="player-settings">
            <h3 class="player-name right">Komputer</h3>
            </div>
            <p class="hint">^ Kliknij na ikone zeby zagrac z graczem</p>`;
    }
    this.querySelector('.player-type-button').addEventListener('click',()=>this.changePlayerType());
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
        <button class="back-to-menu" onclick='document.querySelector("scene-manager").loadScene("main-menu")'>
        <i class="ti ti-arrow-back"></i></button>`;
  }
  connectedCallback(){
    this.sceneManager = document.querySelector("scene-manager");
    this.allTeams = document.querySelectorAll('.team');
    this.startButton = this.querySelector(".start-button");
    this.startButton.onclick = ()=>this.start();    
  }
  start(){
    this.players = {left:[],right:[]};
    this.allTeams.forEach(element => {
      let class_array  = Array.from(element.classList);
      let children_array = Array.from(element.children);
      let team = class_array.pop("team");
      children_array.forEach(player => {
        let keybinds = Array.from(player.playerKeybinds).map(element=>{
          let keyobject = new Object();
          keyobject[element.type] = element.keybind
          console.log(keyobject,element);
          return keyobject
        });
        keybinds = {...keybinds[1], ...keybinds[0]};
        console.log(keybinds, player.playerKeybinds)
        this.players[team].push({name:player.playerName, type:player.playerType, keybinds:keybinds})
      
      });
    });
    this.sceneManager.loadScene('game-board',{players:this.players});
  }
}

window.customElements.define('waiting-room', WaitingRoom); 

