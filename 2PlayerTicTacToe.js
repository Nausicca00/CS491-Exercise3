/*
Date: June 29, 2025
Author: Kaylyn Duncan
*/

// === GAME STATE ===
var board = Array(9).fill("");
var playerTurnCount = 0;
var gameOver = false;

// === UTILITY ===

/**
 * Converts button ID to board index.
 */
function idToIndex(id) {
  return {
    one: 0, two: 1, three: 2,
    four: 3, five: 4, six: 5,
    seven: 6, eight: 7, nine: 8
  }[id];
}

/**
 * Converts board index to button ID.
 */
function indexToId(index) {
  return [
    "one", "two", "three",
    "four", "five", "six",
    "seven", "eight", "nine"
  ][index];
}

/**
 * Checks if someone has won
 * @param {string[]} b - The game board (lenght 9)
 * @returns {{winner: string|null, line: number[]|null}}
 */
function checkWinner(b){
  var wins = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];
  for (let line of wins) {
    var [a, b1, c] = line;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return { winner: b[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * Highlights the winning triple in red 
 */
function highlightWin(line) {
  line.forEach(i => {
    var id = indexToId(i);
    document.getElementById(id).style.color = "red";
  });
}

// === UI LOGIC ===

/**
 * Handles Start/Clear button toggle
 */
function toggleBtn(){
  var btn = document.getElementById("btn");
  if (btn.value === "Clear") {
    // Clear board
    board = Array(9).fill("");
    playerTurnCount = 0;
    gameOver = false;
    btn.value = "Start";

    for (let i = 0; i < 9; i++) {
      var id = indexToId(i);
      var el = document.getElementById(id);
      el.value = "";
      el.disabled = false;
      el.style.color = "black";
    }
  } else {
    // Game hasn't started yet
    var allEmpty = board.every(v => v === "");
    if (allEmpty) {
      btn.value = "Clear";
    }
  }
}

/**
 * Handles player move
 * @param {*} id 
 * @returns 
 */
function makeX(id){
  if (gameOver) return;

  var idx = idToIndex(id);
  if (board[idx] !== "") return;

  var toggle = document.getElementById("btn");
  if (toggle.value === "Start") {
    toggle.value = "Clear";
  }

  board[idx] = "X";
  var btn = document.getElementById(id);
  btn.value = "X";
  btn.disabled = true;

  var result = checkWinner(board);
  if (result.winner) {
    highlightWin(result.line);
    gameOver = true;
    return;
  }

  playerTurnCount++;
}