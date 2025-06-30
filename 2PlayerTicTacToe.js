/*
Date: June 29, 2025
Author: Kaylyn Duncan
*/

//Game Playing Logic
// === GAME STATE ===
var board = Array(9).fill("");
var playerTurnCount = 0;
var computerStarted = false;
var gameOver = false;

//Converts button ID to board index.
function idToIndex(id) {
  return {
    one: 0, two: 1, three: 2,
    four: 3, five: 4, six: 5,
    seven: 6, eight: 7, nine: 8
  }[id];
}

//Converts board index to button ID.
function indexToId(index) {
  return [
    "one", "two", "three",
    "four", "five", "six",
    "seven", "eight", "nine"
  ][index];
}

//Chooses computers move and then checks if there's a winner
function computerTurn(count = 1) {
  for (let i = 0; i < count; i++) {
    if (gameOver) return;

    var move = getBestMove(board);
    if (move == null) return;

    board[move] = "O";
    var id = indexToId(move);
    var btn = document.getElementById(id);
    btn.value = "O";
    btn.disabled = true;

    var result = checkWinner(board);
    if (result.winner) {
      highlightWin(result.line);
      gameOver = true;
      return;
    }
  }
}

//Figures out the best move for the computer based on strategy
function getBestMove(b){
  var empty = b.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  var preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  return preferred.find(i => empty.includes(i)) ?? null;
}

//Checks if someone has won
//@returns {{winner: string|null, line: number[]|null}}
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

//Game Presentation Logic
function toggleBtn(){
  var btn = document.getElementById("btn");
  if (btn.value === "Clear") {
    // reset all
    board = Array(9).fill("");
    playerTurnCount = 0;
    computerStarted = false;
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
    // game hasn't started yet
    var allEmpty = board.every(v => v === "");
    if (allEmpty) {
      computerStarted = true;
      computerTurn(2);
      btn.value = "Clear";
    }
  }
}

//Players move and then checks winner
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

  playerTurnCount++;

  var result = checkWinner(board);
  if (result.winner) {
    highlightWin(result.line);
    gameOver = true;
    return;
  }

  if (!computerStarted && playerTurnCount === 2) {
    // let's player make two moves
    computerTurn(1);
    computerStarted = true;
  } else if (computerStarted && !gameOver) {
    // let's player make one move
    computerTurn(1);
  }
}

function highlightWin(line) {
  line.forEach(i => {
    var id = indexToId(i);
    document.getElementById(id).style.color = "red";
  });
}