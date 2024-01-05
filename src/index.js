import {Game} from "./scripts/game.js";

Game.onLettersUpdate(displayLetters);

Game.onWordUpdate(displayWord);

Game.onWordsUpdate(() => {
    displayWords();
    displayScore();
});

window.onShuffleClick = function() {
    Game.shuffleLetters();
}

window.onClearClick = function() {
    Game.clearWord();
}

window.onLetterClick = function(i) {
    Game.selectLetter(i);
}

window.onSubmitClick = function() {
    Game.submitWord();
    persistState();
}

window.onBackspaceClick = function() {
    Game.backspace();
}

window.onShowHistoryClick = function() {
    document.getElementById('history_modal').showModal();
}

setInterval(() => {
    Game.checkForRollover();
    displayTime();
}, 1000);

function init() {

    Game.init();

    loadState();
    updateDisplay();

    console.log(`the word is ${Game.word.toUpperCase()}`);
}

function displayLetters() {
    for (let i = 0; i < Game.letters.length; i++) {
        document.getElementById('letter_'+i).innerText = Game.letters[i];
    }``
}

function displayWord() {
    
    if (Game.currentWord === "") {
        document.getElementById('current_word').replaceChildren(document.createTextNode("\u00A0"));
    } else {
        document.getElementById('current_word').innerText = Game.currentWord;
    }
    
}

function displayWords() {

    const elements = Game.acceptedWords.sort().map((word) => {
        const el = document.createElement('div');

        if (Game.letters.every(c => word.indexOf(c) >= 0)) {
            el.innerHTML = word + "✨";
        } else {
            el.innerHTML = word;
        }

        return el;
    });

    document.getElementById('previous_words').replaceChildren(...elements);

}

function displayScore() {
    document.getElementById('current_score').innerText = Game.getScore();
    document.getElementById('current_count').innerText = Game.acceptedWords.length;
}

function displayTime() {
    const d = new Date(Game.timeUntilNext());

    const s = [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
        .map(leftPad)
        .join(":");

    document.getElementById('time_until').innerText = s;
}

function leftPad(n) {
    return (n < 10) ? "0"+n : ""+n;
}

function updateDisplay() {
    displayLetters();
    displayWord();
    displayWords();
    displayScore();
    displayTime();
}

const STATE_KEY = "game_state_";

function persistState() {
    const state = Game.getState();
    const key = STATE_KEY + state.word;

    window.localStorage.setItem(key, JSON.stringify(state));
}

function loadState() {
    const key = STATE_KEY + Game.word;
    const state = window.localStorage.getItem(key);
    if (state) {
        Game.setState(JSON.parse(state));
    }
}

init();
