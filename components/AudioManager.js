class AudioManager extends HTMLElement {
  constructor(){
    super();
    this.paddleSounds = [
      new Audio("assets/audio/soundEffects/ping-pong-1.mp3"),
      new Audio("assets/audio/soundEffects/ping-pong-2.mp3"), 
      new Audio("assets/audio/soundEffects/ping-pong-3.mp3"),
      new Audio("assets/audio/soundEffects/ping-pong-4.mp3"),
      new Audio("assets/audio/soundEffects/ping-pong-5.mp3"),
    ];
    this.goalSound = new Audio('assets/audio/soundEffects/goal.flac');
    this.ballLaunchSound = new Audio('assets/audio/soundEffects/air_explosion.wav');
    this.ballLaunchSound.volume = 0.5;
    this.backgroundMusic = new Audio('assets/audio/music/happy-background.mp3');
    this.backgroundMusic.volume = 0.3;
    window.onclick = ()=>this.startBackground();
  }
  startBackground(){
    this.backgroundMusic.play();
    this.backgroundMusic.loop = true;
    window.onclick = undefined;
  }
  playBallLaunchSound(){
    this.ballLaunchSound.play();
  }
  playPaddleSound(){
    const random = Math.floor(Math.random() * this.paddleSounds.length);
    this.paddleSounds[random].play();
  }
  playGoalSound(){
    this.goalSound.play();
  }
}

window.customElements.define('audio-manager', AudioManager);
