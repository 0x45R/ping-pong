class AudioManager extends HTMLElement {
  constructor(){
    super();
    // Tablica posiadajaca wszystkie dzwieki zwiazane z odbiciem pileczki
    this.paddleSounds = [
      new Audio("assets/audio/soundEffects/ping-pong-1.mp3"),
      new Audio("assets/audio/soundEffects/ping-pong-2.mp3"), 
      new Audio("assets/audio/soundEffects/ping-pong-3.mp3"),
      new Audio("assets/audio/soundEffects/ping-pong-4.mp3"),
      new Audio("assets/audio/soundEffects/ping-pong-5.mp3"),
    ];
    // Dzwiek po zdobyciu punktu
    this.goalSound = new Audio('assets/audio/soundEffects/goal.flac');
    // Dzwiek wystrzelenia pileczki
    this.ballLaunchSound = new Audio('assets/audio/soundEffects/air_explosion.wav');
    this.ballLaunchSound.volume = 0.5;
    // Kiedy uzytkownik kliknie cokolwiek na ekranie wtedy zacznij grac muzyke tytulowa
    // To jest obejscie ochrony przed autoplay (wiele przegladarek bazowanych na chromium zabrania puszczania dzwieku przed interakcja uzytkownika)
    this.backgroundMusic = new Audio('assets/audio/music/happy-background.mp3');
    this.backgroundMusic.volume = 0.3;
    window.addEventListener('click',()=>this.startBackground());
  }
  startBackground(){
    // Wlacz muzyke
    this.backgroundMusic.play();
    this.backgroundMusic.loop = true;
    // Usun event 'click'
    window.onclick = undefined
  }
  playBallLaunchSound(){
    // Pusc dzwiek wystrzelenia pilki
    this.ballLaunchSound.play();
  }
  playPaddleSound(){
    // Wybierz losowy indeks z tablicy paddleSounds
    const random = Math.floor(Math.random() * this.paddleSounds.length);
    // Zagraj losowy dzwiek z tej tablicy
    this.paddleSounds[random].play();
  }
  playGoalSound(){
    // Pusc dzwiek zdobycia bramki
    this.goalSound.play();
  }
}

window.customElements.define('audio-manager', AudioManager);
