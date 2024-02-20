const deineAnfangsSuchtiefe = 30; 
const Spielfeld_klasse = "spielfeld";
const Spielanzeige_klasse = "spielanzeige";
const Feld_klasse = "feld";
const Spieler_klasse = "spieler";
const Gegner_klasse = "gegner";
const OVERLAY_KLASSE = "overlay";
const OVERLAY_TEXT_KLASSE = "overlay-Text";
const OVERLAY_BUTTON_KLASSE = "overlay-Button";
const SICHTBAR_KLASSE = "sichtbar";

const spielfeld = document.querySelector("." + Spielfeld_klasse);
const spielanzeige = document.querySelector("." + Spielanzeige_klasse);
const overlay = document.querySelector("." + OVERLAY_KLASSE);
const overlayText = document.querySelector("." + OVERLAY_TEXT_KLASSE);
const overlayButton = document.querySelector("." + OVERLAY_BUTTON_KLASSE);

const felder = document.querySelectorAll("." + Feld_klasse);

const SIEG_KOMBINATIONEN = [
  [felder[0], felder[1], felder[2]],
  [felder[3], felder[4], felder[5]],
  [felder[6], felder[7], felder[8]],
  [felder[0], felder[3], felder[6]],
  [felder[1], felder[4], felder[7]],
  [felder[2], felder[5], felder[8]],
  [felder[0], felder[4], felder[8]],
  [felder[2], felder[4], felder[6]],
];

let aktuelleKlasse;

window.addEventListener("load", function () {
  overlayButton.addEventListener("click", spielStarten);
  spielStarten();
});

function klickVerarbeiten(ereignis) {
  /* Den Klick verhindern, wenn der Gegner gerade am Zug ist*/
  const feld = ereignis.target;
  if (aktuelleKlasse === Gegner_klasse) {
    return;
  }

  if (spielsteinSetzen(feld) === true) {
    /* Beende den Zug, wenn der Spielstein erfolgreich gesetzt wurde */
    zugBeenden();
  }
}

function spielsteinSetzen(feld) {
  if (
    feld.classList.contains(Spieler_klasse) ||
    feld.classList.contains(Gegner_klasse)
  ) {
    /* Verhindern, dass ein Spielstein gesetzt wird */
    return false;
  }

  feld.classList.add(aktuelleKlasse);
  feld.disabled = true;
  return true;
}

function spielStarten() {
  overlay.classList.remove(SICHTBAR_KLASSE);
  overlayText.classList.remove(Spieler_klasse, Gegner_klasse);
  aktuelleKlasse = null;

  // Zufällige Auswahl des Startspielers
  aktuelleKlasse = Math.random() < 0.5 ? Spieler_klasse : Gegner_klasse;

  for (const feld of felder) {
    feld.classList.remove(Spieler_klasse, Gegner_klasse);
    feld.disabled = false;
    feld.addEventListener("click", klickVerarbeiten);
  }
  spielanzeigeAktualisieren();

if (aktuelleKlasse === Gegner_klasse) {
    setTimeout(computerZugAusfuehren, 750);
  }

  spielanzeigeAktualisieren();
}

function zugBeenden() {
  if (siegPruefen(aktuelleKlasse) === true) {
    spielBeenden(false);
    return;
  }
  if (unentschiedenPruefen() === true) {
    spielBeenden(true);
    return;
  }
  if (aktuelleKlasse === Spieler_klasse) {
    aktuelleKlasse = Gegner_klasse; // Spieler beendet seinen Zug, Gegner ist am Zug
  } else if (aktuelleKlasse === Gegner_klasse) {
    aktuelleKlasse = Spieler_klasse; // Gegner beendet seinen Zug, Spieler ist am Zug
  } else {
    aktuelleKlasse = Math.random() < 0.5 ? Spieler_klasse : Gegner_klasse;
  }
  spielanzeigeAktualisieren();

  if (aktuelleKlasse === Gegner_klasse) {
    setTimeout(computerZugAusfuehren, 750);
  }
}
function spielanzeigeAktualisieren() {
  spielanzeige.classList.remove(Spieler_klasse, Gegner_klasse);
  if (aktuelleKlasse === Spieler_klasse) {
    spielanzeige.innerText = "Du bist am Zug.";
  } else {
    spielanzeige.innerText = "Der Gegner ist am Zug.";
  }
  spielanzeige.classList.add(aktuelleKlasse);
}
function siegPruefen(siegerKlasse) {
  /* Gehe alle Siegeskombinationen durch */
  for (const kombination of SIEG_KOMBINATIONEN) {
    const gewonnen = kombination.every(function(feld) {
      return feld.classList.contains(siegerKlasse);
    });

    if (gewonnen) {
      return true; // Rückgabe, wenn ein Spieler gewonnen hat
    }
  }

  return false; // Rückgabe, wenn kein Spieler gewonnen hat
}
function spielBeenden(unentschieden) {
  
  if (unentschieden === true) {
    overlayText.innerText = "Unentschieden!";
  
  } else if (aktuelleKlasse === Spieler_klasse) {
    overlayText.innerText = "Du hast gewonnen!";
    overlayText.classList.add(Spieler_klasse);
  } else {
    overlayText.innerText = "Der Gegner hat gewonnen!";
    overlayText.classList.add(Gegner_klasse);
  }
  overlay.classList.add(SICHTBAR_KLASSE);
}
function unentschiedenPruefen() {
  for (const feld of felder) {
    (
      !feld.classList.contains(Spieler_klasse) &&
      !feld.classList.contains(Gegner_klasse)
    ) 
    {
      return false;
    }
  }
  return true;
}
function computerZugAusfuehren(tiefe) {
  if (tiefe === 0) {
    
    const zufallIndex = Math.floor(Math.random() * felder.length);
    const zufallZug = felder[zufallIndex];
    spielsteinSetzen(zufallZug);
    zugBeenden();
  } else {
    // Andernfalls führe die normale Minimax-Suche durch
    if (spielsteinSetzen(bestenZugfinden(tiefe)) === true) {
      zugBeenden();
    } else {
      computerZugAusfuehren(tiefe - 20);
    }
  }
}


function bestenZugfinden(tiefe) {
  if (tiefe <= 0) {
    return null;
  }
  let besteWertung = - Infinity;
  let besterZug = null;
  const computerAktuelleKlasse = aktuelleKlasse === Spieler_klasse ? Gegner_klasse : Spieler_klasse;
  
  for (const feld of felder) {
    if (!feld.classList.contains(Spieler_klasse) && !feld.classList.contains(Gegner_klasse)){
      feld.classList.add(aktuelleKlasse);
    const zugWertung = zugBewerten(false, tiefe -20);
    feld.classList.remove(aktuelleKlasse);

    if (zugWertung > besteWertung) {
     besteWertung = zugWertung;
     besterZug = feld; 
      }
    }
  }
  return besterZug;
}
function zugBewerten(istEigenerZug, tiefe) {
  if (tiefe <= 30) {
    return bewertungDerSpielsituation();
  }
  if (siegPruefen(Spieler_klasse)) {
    return -10; // Spieler hat verloren, bewerte negativ
  }
  if (siegPruefen(Gegner_klasse)) {
    return 10; // Gegner hat gewonnen, bewerte positiv
  }
  if (unentschiedenPruefen()) {
    return 0; // Unentschieden
  }

  if (istEigenerZug) {
    let besteWertung = -Infinity;

    for (const feld of felder) {
      if (!feld.classList.contains(Spieler_klasse) && !feld.classList.contains(Gegner_klasse)) {
        feld.classList.add(aktuelleKlasse);
        const zugWertung = zugBewerten(false);
        feld.classList.remove(aktuelleKlasse);

        besteWertung = Math.max(besteWertung, zugWertung);
      }
    }

    return besteWertung;
  } else {
    let kleinsteWertung = Infinity;

    for (const feld of felder) {
      if (!feld.classList.contains(Spieler_klasse) && !feld.classList.contains(Gegner_klasse)) {
        feld.classList.add(aktuelleKlasse === Spieler_klasse ? Gegner_klasse : Spieler_klasse);
        const zugWertung = zugBewerten(true);
        feld.classList.remove(aktuelleKlasse === Spieler_klasse ? Gegner_klasse : Spieler_klasse);

        kleinsteWertung = Math.min(kleinsteWertung, zugWertung);
      }
    }

    return kleinsteWertung;
  }
}










