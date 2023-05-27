class SceneManager extends HTMLElement {
  constructor(){
    super();
    this.scene = document.createElement(this.getAttribute('default'));
    this.appendChild(this.scene);
    //this.children_array = Array.from(this.children);
    //console.log(this.children)
    //this.loadScene(this.getAttribute('default') || this.children_array[0].id);
  }
  
  loadScene(scene, data={}){
    this.removeChild(this.scene)
    let SceneElement = window.customElements.get(scene);
    this.scene = new SceneElement(data);
    //add a mf transition
    this.append(this.scene); 
    /*console.log(scene, this.scene);   
    this.children_array.forEach((child)=>{ 
      child.sceneUnloaded(); 
      Array.from(child.children).forEach((elem)=>{elem.disabled=true})
    }); // child.classList.add("hidden")
    this.scene.sceneLoaded(data);
    Array.from(this.scene.children).forEach((elem)=>{elem.disabled=false})*/
    //this.scene.classList.remove("hidden");
  }
}

window.customElements.define('scene-manager', SceneManager);
