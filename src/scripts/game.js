import {WordsList} from "./words.js";
import {AllWordsList} from "./all_words.js";

// const TIME_MODULUS = 1000 * 60 // new word every minute
const TIME_MODULUS = 1000 * 60 * 60 * 24 // new word every day
const TIME_OFFSET = 1000 * 60 * 60 * 13 // 12 hours

export const Game = {

    word: '',
    letters: [],

    acceptedWords: [],

    currentWord: '',

    init() {

        this.word = this.getWord();
        this.letters = this.getLetters();
        shuffle(this.letters);

        this.acceptedWords = [];
        this.currentWord = '';

        this._onLettersUpdate();
        this._onWordUpdate();
        this._onWordsUpdate();

    },

    getState() {
        return {
            'word': this.word,
            'accepted_words': this.acceptedWords,
            'score': this.getScore(),
        }
    },

    setState(state) {
        if (this.word === state.word) {
            this.acceptedWords = state.accepted_words;
            return true;
        }

        return false;
    },

    checkForRollover() {
        if (this.getWord() !== this.word) {
            this.init();
        }
    },

    getLetters() {
        const letters = new Set();

        this.getWord()
            .split('')
            .forEach(c => letters.add(c.toUpperCase()));

        var letters_arr = Array.from(letters);

        let vowel = getPseudoRandomElement(letters_arr.filter(isVowel));

        if (isValentinesDay()) {
            vowel = 'I';
        }

        letters_arr = letters_arr.filter(c => c !== vowel)
        letters_arr.push(vowel);

        return letters_arr;
    },

    getWord() {
        if (isValentinesDay()) {
            return "nick♥zina";
        } else {
            return getPseudoRandomElement(WordsList);
        }
    },

    getScore() {
        return this.acceptedWords.reduce((acc, cur) =>  {
            return acc += cur.length;
        }, 0);
    },

    shuffleLetters() {
        shuffle(this.letters);
        this._onLettersUpdate();
    },

    clearWord() {
        this.currentWord = '';
        this._onWordUpdate();
    },

    submitWord() {
        // check that the word contains the middle letter which is the last element of the letters array
        const vowel = this.letters[this.letters.length-1];

        if (this.currentWord.indexOf(vowel) < 0) {
            console.log(`word '${this.currentWord}' does not contain a '${vowel}'`);
            return false;
        }
        
        // check that the word isn't already submitted
        if (this.acceptedWords.some((w) => w === this.currentWord)) {
            console.log(`word '${this.currentWord}' already entered`);
            return false;
        }

        // check that the word is in the dictionary
        //todo: the dictionary is ordered, so can do a binary search here
        if (!AllWordsList.some((w) => w === this.currentWord.toLowerCase())) {
            console.log(`word '${this.currentWord}' does not exist in dictionary`);
            return false;
        }

        this.acceptedWords.push(this.currentWord);
        this._onWordsUpdate();
        this.clearWord();
        
        return true;
    },

    selectLetter(i) {

        if (i > this.letters.length - 1) {
            return;
        }

        this.currentWord += this.letters[i];
        this._onWordUpdate();
    },

    backspace() {
        this.currentWord = this.currentWord.substring(0, Math.max(this.currentWord.length-1, 0));
        this._onWordUpdate();
    },

    // on letters update
    _onLettersUpdate: () => {},

    onLettersUpdate: function(fn) {
        this._onLettersUpdate = fn;
    },

    // on word update
    _onWordUpdate: () => {},

    onWordUpdate: function(fn) {
        this._onWordUpdate = fn;
    },

    // on words update
    _onWordsUpdate: () => {},

    onWordsUpdate: function(fn) {
        this._onWordsUpdate = fn;
    },

    timeUntilNext: () => {
        return TIME_MODULUS - (Date.now() + TIME_OFFSET) % TIME_MODULUS;
    }

}

function rand(seed) {

    for (let i = 0; i < 10; i++) {
        seed = middleSquare(seed)
    }

    return seed;
}

function middleSquare(n) {  
    const len = ('' +n).length;
    let m = ''+ (n*n);
    if (m.length %2 !== len %2) m = '0' + m;
    return parseInt(m.substring(len/2, len/2 + len), 10);
}

// shuffle an array in place excluding the tail element
function shuffle(a) {
    for (let i = a.length - 2; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let k = a[i];
        a[i] = a[j];
        a[j] = k;
    }
}

function getPseudoRandomElement(a) {
    let n = Math.floor((Date.now() + TIME_OFFSET) / TIME_MODULUS) // number of minutes since the epoch
    return a[rand(n) % a.length]
}


function isVowel(c) {
    return c === 'A' ||
           c === 'E' ||
           c === 'I' ||
           c === 'O' ||
           c === 'U';
}

function isValentinesDay() {
    const date = new Date();
    return date.getDate() === 14 && date.getMonth() === 1
}
