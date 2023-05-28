class SceneManager extends HTMLElement {
  constructor(){
    super();
    this.scene = document.createElement(this.getAttribute('default'));
    this.transitionDuration = 500;
    this.appendChild(this.scene);
    //this.children_array = Array.from(this.children);
    //console.log(this.children)
    //this.loadScene(this.getAttribute('default') || this.children_array[0].id);
  }
  
  loadScene(scene, data={}){
    this.animate([{opacity:1},{opacity:0},{opacity:1}], {duration:this.transitionDuration})
    setTimeout(()=>{
      this.removeChild(this.scene)
      let SceneElement = window.customElements.get(scene);
      this.scene = new SceneElement(data);
      this.append(this.scene); 
    }, this.transitionDuration/2)

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
