/*
  *Add winnig message(genius) done
    !Add animation
  ^ -add functionality to keyboard
*/
"use strict";
let hiddenWord = "HELLO",
  remainLetters; // remainLetters is used to solve the duplicate in the checking method

// function getRandomWord() {
//   return fetch("https://random-word-api.herokuapp.com/word?length=5")
//     .then((response) => response.json())
//     .then((data) => (hiddenWord = remainLetters = data[0].toUpperCase()));
// }
// getRandomWord();
let [row, column] = [0, 0];
let gameRunning = true;
let score = 0;
const rows = document.querySelectorAll(".row");
let currentRow = rows[row].querySelectorAll(".word");
const messageContainer = document.querySelector(".message-container");
const revealTime = 300;
const checkAlpha = function (letter) {
  if (letter.length === 1)
    return (
      letter.toUpperCase().charCodeAt() >= 65 &&
      letter.toUpperCase().charCodeAt() <= 90
    );
  else return false;
};

// input event
const removeLetter = function () {
  column--;
  currentRow[column].textContent = "";
  currentRow[column].classList.remove("active");
};
const addLetter = function (letter) {
  currentRow[column].textContent = letter.toUpperCase();
  currentRow[column].classList.add("active");
  column++;
};
const checkWord = function () {
  // checking if the word is in full length
  if (column != 5) {
    showMessage("Not Enough Letters");
    // word length is invalid
    rows[row].style.animation = "wrong-row 0.12s 3 ease-in-out"; // i'm sure ther's a better way to do it
    setTimeout((_) => {
      // remove animation so we can use it again
      rows[row].style.animation = "none";
    }, 500);
  } else {
    // the word is valid to be checked
    remainLetters = hiddenWord;
    checkRightLetters(currentRow);
    checkMissLetters(currentRow);
    revealLetter(currentRow);
    // update the current row
    if (score == 5) gameEnding(true);
    else if (row === 5) gameEnding(false);
    else {
      score = 0;
      column = 0;
      row++;
      currentRow = rows[row].querySelectorAll(".word");
    }
  }
};
const revealLetter = function (word, index = 0) {
  // revealLetter is a recursive function that accepts word and index and check every letter in word with coresponding letter in hidden word it will call it self to the end of word
  gameRunning = false;
  checkLetter(word[index]);
  setTimeout(function () {
    if (index === word.length - 1) {
      gameRunning = true;
      return;
    } else revealLetter(word, ++index);
  }, revealTime);
};
const checkLetter = function (wordLetter) {
  // this function accepts two letters and check if they are equal and adding classes to the first word letter to declare it's state
  wordLetter.classList.add("checked");
  if (wordLetter.classList.contains("right")) {
    wordLetter.classList.remove("right");
    wordLetter.classList.add("correct");
  } else if (wordLetter.classList.contains("miss")) {
    wordLetter.classList.remove("miss");
    wordLetter.classList.add("missplace");
  } else {
    wordLetter.classList.add("wrong");
  }
};
const checkRightLetters = function (word) {
  // this function accepts two letters and check if they are equal and adding classes to the first word letter to declare it's state
  word.forEach((letter, i) => {
    if (letter.textContent === hiddenWord[i]) {
      letter.classList.add("right");
      score++;
      // remove the letter if it has already used
      remainLetters = remainLetters.replace(letter.textContent, "");
    }
  });
};
const checkMissLetters = function (word) {
  word.forEach((letter) => {
    if (remainLetters.includes(letter.textContent)) {
      letter.classList.add("miss");
      // remove the letter if it has already used
      remainLetters = remainLetters.replace(letter.textContent, "");
    }
  });
};
document.addEventListener("keydown", function (e) {
  if (!gameRunning || !hiddenWord) return;
  if (e.key === "Backspace" && column > 0) {
    removeLetter();
  } else if (checkAlpha(e.key) && column < 5) {
    addLetter(e.key);
  } else if (e.key === "Enter") {
    checkWord();
  }
});
const gameEnding = function (winning) {
  gameRunning = false;

  setTimeout(function () {
    showMessage(`${winning ? "Gineus" : hiddenWord}`, false);
  }, 5 * revealTime + 100); // +100 to make sure the reveal was done
};
const showMessage = function (text, hide = true) {
  const message = document.createElement("div");
  message.classList.add("message");
  message.textContent = text;
  messageContainer.prepend(message);
  if (hide) {
    message.classList.add("fade");
    setInterval(function () {
      messageContainer.removeChild(message);
    }, 2000);
  }
};
