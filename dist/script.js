const board = document.getElementById("board");
const main = document.getElementById("main");
const text = document.createElement("h1");
const btn = document.createElement("button");
btn.textContent = "PLAY AGAIN";
btn.className = "px-4 py-1.5 bg-neutral-400 text-neutral-200 rounded-xl font-medium hover:bg-neutral-500";
text.className = "text-center text-lg my-4 text-neutral-100 font-semibold";

let position;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let word = [];
let colors = ["", "", "", "", ""];
let wordToGuess = [];
let wordString = "";
let col = 1;
let guess;

function getWord() {
    return fetch("https://random-word-api.herokuapp.com/word?length=5")
        .then(response => {
            if (!response.ok) throw new Error("Couldn't get word");
            return response.json();
        })
        .then(data => {
            wordString = data[0];
        })
        .catch(error => {
            console.error(error);
            wordString = "apple";
        });
}

function wordToArray() {
    wordToGuess = wordString.split("");
}

function makeBoard() {
    for (let i = 1; i < 7; i++) {
        const div = document.createElement("div");
        div.className = "grid grid-cols-5 row-span-1 gap-2";
        board.appendChild(div);
        for (let j = 1; j < 6; j++) {
            const innerDiv = document.createElement("div");
            innerDiv.id = `${i}_${j}`;
            innerDiv.className = "col-span-1 size-16 my-1 border-2 flex justify-center items-center text-neutral-100 text-2xl font-bold border-neutral-700";
            div.appendChild(innerDiv);
        }
    }
}

function gameEnd() {
    document.removeEventListener("keydown", handleKeyDown);
    main.appendChild(btn);
    btn.addEventListener("click", () => {
        while (board.firstChild) {
            board.firstChild.remove();
        }
        makeBoard();
        col = 1;
        word = [];
        btn.remove();
        text.remove();
        document.addEventListener("keydown", handleKeyDown);
    });
    getWord().then(() => {
        wordToArray();
    });
}

function checker() {
    if (word.join("") === wordString) {
        guess = `You guessed the word in ${col} ${col === 1 ? 'try' : 'tries'}`;
        text.textContent = guess;
        main.appendChild(text);
        gameEnd();
    }

    colors = ["", "", "", "", ""];
    let copyWordToGuess = [...wordToGuess];
    for (let i = 0; i < 5; i++) {
        if (word[i] === wordToGuess[i]) {
            colors[i] = "G";
            copyWordToGuess[i] = "";
        }
    }
    for (let i = 0; i < 5; i++) {
        if (colors[i] === "") {
            if (copyWordToGuess.includes(word[i])) {
                colors[i] = "Y";
                copyWordToGuess[copyWordToGuess.indexOf(word[i])] = "";
            } else {
                colors[i] = "GR";
            }
        }
    }
}

function color() {
    for (let i = 1; i < 6; i++) {
        let colorDiv = document.getElementById(`${col}_${i}`);
        switch (colors[i - 1]) {
            case "G":
                colorDiv.style.backgroundColor = "#2b8a2e";
                break;
            case "Y":
                colorDiv.style.backgroundColor = "#bfa619";
                break;
            case "GR":
                colorDiv.style.backgroundColor = "#2b2a24";
                break;
        }
    }
}

function handleKeyDown(event) {
    let keyName = event.key.toUpperCase();
    if (keyName === "ENTER" && word.length === 5) {
        checker();
        color();
        col++;
        if (col === 7) {
            guess = `You didn't guess the word, it was ${wordString.toUpperCase()}`;
            text.textContent = guess;
            main.appendChild(text);
            gameEnd();
        }
        word = [];
    } else if (keyName === "BACKSPACE" && word.length > 0) {
        word.pop();
        position = word.length;
        const divLetter = document.getElementById(`${col}_${position + 1}`);
        divLetter.textContent = "";
    } else if (letters.includes(keyName) && word.length < 5) {
        word.push(keyName.toLowerCase());
        position = word.length;
        const divLetter = document.getElementById(`${col}_${position}`);
        divLetter.textContent = keyName;
    }
}

function initGame() {
    getWord().then(() => {
        wordToArray();
        makeBoard();
        document.addEventListener("keydown", handleKeyDown);
    });
}

initGame();
