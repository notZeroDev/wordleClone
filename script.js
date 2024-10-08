"use strict";
const dict = ["apple","brink","chair","dance","eagle","flare","ghost","hound","ivory","jolly","kayak","lemon","music","nerve","olive","place","queen","radio","smile","truck","unity","voice","water","xylos","young","zebra","brick","climb","drain","empty","fruit","grape","heart","index","joint","kneel","laugh","metal","night","ocean","peace","quilt","rough","sharp","teach","uncle","vapor","whale","yield","blaze","crisp","dance","elbow","frown","grain","honey","input","joker","lemon","minor","nurse","onion","pilot","quiet","relax","scale","trust","unity","virus","world","yeast","zebra","angle","brave","carve","diner","earth","frost","glint","hover","ivory","jolly","kneel","lunar","march","niche","olive","place","quite","react","slope","trail","upset","valid","whisk","yacht","zoney","apple","brink","chair"];

const hiddenWord = dict[Math.floor(Math.random() * 101)].toUpperCase();
let remainLetters; // remainLetters is used to solve the duplicate in the checking method
const rows = document.querySelectorAll(".row");
const messageContainer = document.querySelector(".message-container");
const keyboard = document.querySelector(".keyboard");
const keyboardKeys = keyboard.querySelectorAll(".btn");
let [row, column] = [0, 0];
let gameRunning = true;
let score = 0;
let currentRow = rows[row].querySelectorAll(".word");
const revealTime = 300;

// cheacks if the letter is alphabetical
const checkAlpha = function (letter) {
  if (letter.length === 1)
    return (
      letter.toUpperCase().charCodeAt() >= 65 &&
      letter.toUpperCase().charCodeAt() <= 90
    );
  else return false;
};

const removeLetter = function () {
  if (column > 0) {
    column--;
    currentRow[column].textContent = "";
    currentRow[column].classList.remove("active");
  }
};
const addLetter = function (letter) {
  if (column < 5) {
    currentRow[column].textContent = letter.toUpperCase();
    currentRow[column].classList.add("active");
    column++;
  }
};

const revealLetter = function (word, index = 0) {
  // revealLetter is a recursive function that accepts word and index and check every letter in word with coresponding letter in hidden word it will call it self to the end of word
  gameRunning = false;
  checkLetter(word[index]);
  setTimeout(function () {
    if (index === word.length - 1) {
      if (score !== 5) gameRunning = true;
      return;
    } else revealLetter(word, ++index);
  }, revealTime);
};
const checkLetter = function (wordLetter) {
  // this function first add checked class to letter to add animation then checks the current letter class from the first iteration and replace the inital state class with the final one and add wrong if it has no initial state
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
  // this function checks if the letter is correct and add the right class to it and then remove the letter form reaminLetters
  word.forEach((letter, i) => {
    if (letter.textContent === hiddenWord[i]) {
      letter.classList.add("right");
      score++;
      // remove the letter if it has been already used
      remainLetters = remainLetters.replace(letter.textContent, "");
    }
  });
};
const checkMissLetters = function (word) {
  // this function checks if the letter is in missplace and cheks if the letter has no correct class so not update it's value from correct to miss and then remove the letter from remain letters
  word.forEach((letter) => {
    if (
      remainLetters.includes(letter.textContent) &&
      !letter.classList.contains("right")
    ) {
      letter.classList.add("miss");
      // remove the letter if it has been already used
      remainLetters = remainLetters.replace(letter.textContent, "");
    }
  });
};

const showMessage = function (text, hide = true, period = 2) {
  const message = document.createElement("div");
  message.classList.add("message");
  message.textContent = text;
  messageContainer.prepend(message);
  if (hide) {
    message.classList.add("fade");
    message.style.animation = `delete-message ${period}s ease-in-out`;
    setTimeout(function () {
      messageContainer.removeChild(message);
    }, period * 1000);
  }
};
const gameEnding = function (winning) {
  gameRunning = false;

  setTimeout(function () {
    if (winning) {
      showMessage("Genius", true, 5);
      winningAnimation(currentRow);
    } else {
      showMessage(hiddenWord, false);
    }
  }, 1600);
};
const updateKeyboard = function (word) {
  word.forEach((letter) => {
    const letterKey = [...keyboardKeys].find(
      (key) => key.textContent === letter.textContent
    );
    if (letter.classList.contains("right")) {
      letterKey.classList.add("correct");
      letterKey.classList.remove("missplace");
      letterKey.classList.remove("wrong");
    } else if (
      letter.classList.contains("miss") &&
      !letterKey.classList.contains("correct")
    ) {
      letterKey.classList.add("missplace");
      letterKey.classList.remove("wrong");
    } else if (
      !letter.classList.contains("miss") &&
      !letterKey.classList.contains("correct") &&
      !letterKey.classList.contains("missplace")
    ) {
      letterKey.classList.add("wrong");
    }
  });
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
    updateKeyboard(currentRow);
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
const animationLetter = function (letter) {
  letter.classList.add("winning");
};
const winningAnimation = function (word, index = 0) {
  animationLetter(word[index]);
  setTimeout(function () {
    if (index === word.length - 1) {
      return;
    } else winningAnimation(word, ++index);
  }, 150);
};
document.addEventListener("keydown", function (e) {
  console.log(gameRunning);
  if (!gameRunning) return;
  if (e.key === "Backspace") {
    removeLetter();
  } else if (checkAlpha(e.key)) {
    addLetter(e.key);
  } else if (e.key === "Enter") {
    checkWord();
  }
});
keyboard.addEventListener("click", function (e) {
  console.log(gameRunning);
  if (!gameRunning) return;
  const button = e.target.closest(".btn");
  if (!button) return;
  if (button.classList.contains("backspace")) removeLetter();
  else if (button.classList.contains("enter")) checkWord();
  else addLetter(button.textContent);
});
