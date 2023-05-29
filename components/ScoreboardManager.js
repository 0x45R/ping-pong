class ScoreManager extends HTMLElement{
  constructor(){
    super();
  }
  getRecords(){
    // Funkcja uzyskuje rekordy z localStorage

    // Jezeli rekord o kluczu 'scoreboard' nie istnieje to
    if(localStorage.getItem('scoreboard') === null){
      // Stworz go
      localStorage.setItem('scoreboard', JSON.stringify({}));
    }
    // Zwroc przetworzona wartosc rekordu o kluczu 'scoreboard'
    return JSON.parse(localStorage.getItem('scoreboard'));
  }
  addNewPlayer(name, won){
    // Uzyskaj rekordy i zapisz je do zmiennej records
    let records = this.getRecords();
    // Jezeli imie gracza nie znajduje sie w rekordach
    if(!(name in records)){
      // To je dodaj
      records[name] = JSON.stringify({wins:0, games: 0});
    }
    // Uzyskaj wartosc rekordu gracza
    let player = JSON.parse(records[name]);
    // Jezeli gracz wygral to zwieksz ilosc jego wygranych
    if(won){player.wins++}
    // Zwieksz ilosc rozgrywek
    player.games ++;

    // Zaktualizuj rekordy
    records[name] = JSON.stringify(player)
    localStorage.setItem('scoreboard', JSON.stringify(records));
  }

}

window.customElements.define('score-manager', ScoreManager); 
