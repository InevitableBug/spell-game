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

    const elements = Game.acceptedWords.map((word) => {
        const el = document.createElement('div');
        el.innerHTML = word;
        return el;
    });

    document.getElementById('previous_words').replaceChildren(...elements);

}

function displayScore() {
    document.getElementById('current_score').innerText = Game.getScore();
}

function updateDisplay() {
    displayLetters();
    displayWord();
    displayWords();
    displayScore();
}

function persistState() {
    const state = Game.getState();
    window.localStorage.setItem("game_state", JSON.stringify(state));
}

function loadState() {
    const state = window.localStorage.getItem("game_state");
    if (state) {
        Game.setState(JSON.parse(state));
    }
}

init();
