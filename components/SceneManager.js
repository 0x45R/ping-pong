class SceneManager extends HTMLElement {
  constructor(){
    super();
    // Stworz element o tagu podanym w atrybucie default i przypisz go do zmiennej scena
    this.scene = document.createElement(this.getAttribute('default'));
    // Ustaw dlugosc animacji na 500ms
    this.transitionDuration = 500;
    // Dodaj scene do tego elementu
    this.appendChild(this.scene);
  }
  
  loadScene(scene, data={}){
    // Funkcja laduje scene poprzez podmiane elementow

    // Animuj przezroczystosc tego elementu przez 500ms
    this.animate([{opacity:1},{opacity:0},{opacity:1}], {duration:this.transitionDuration})
    // Po 250ms
    setTimeout(()=>{
      // Usun scene/dziecko
      this.removeChild(this.scene)
      // Zdobadz element nowej sceny
      let SceneElement = window.customElements.get(scene);
      // Ustaw ten element jako nowa scene;
      this.scene = new SceneElement(data);
      // Dodaj scene do tego elementu
      this.append(this.scene); 
    }, this.transitionDuration/2)
  }
}

window.customElements.define('scene-manager', SceneManager);
