var wins = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];
var mainBoard = [null,1,2,3,4,5,6,7,8,9];
var humanPlayer;
var computerPlayer;
var AILevel; // 1 = idiot, 2 = unbeatable
var goesFirst;
var winCombo;
var won;

$(document).ready(function(){
  reset();
})

$(".markerButton").click(function(){
  var mark = $(this).html();
  humanPlayer = mark;
  computerPlayer = (mark === "X" ? "O" : "X");
  $(".markerChoice").css('visibility','hidden');
  $(".difficultyChoice").css('visibility','visible');
})

$(".difficultyButton").click(function(){
  if ($(this).attr("id") === "easyAI"){
    AILevel = 1;
  } else { AILevel = 2; }
  $(".difficultyChoice").css('visibility','hidden');
  $("#board").css('visibility','visible');
  newGame();
})

$("#reset").click(reset);
$("#playAgain").click(function(){
  newGame();
  $("#endOpts").css('visibility','hidden');
})

$(".cell").click(function(){
  var placeID = parseInt($(this).attr("id"));
  if (spacesLeft(mainBoard).includes(placeID) && won === false){
    mainBoard[placeID] = humanPlayer;
    $(this).html("<span>" + humanPlayer + "</span>");
    $(this).find("span").animate({opacity:1});
    if (winner(humanPlayer, mainBoard)){
      win("YOU WIN");
      return;
    }
    computerMove();
    if (winner(computerPlayer, mainBoard)){
      win("COMPUTER WINS");
      return;
    }
    if (spacesLeft(mainBoard).length === 0) {
      winCombo = [];
      win("TIE");
      return;
    }
  }
})

function spacesLeft(board){
  return board.filter(space => space && space != "O" && space != "X");
}

function winner(player, board) {
  for (i = 0; i < wins.length; i++){
    if (board[wins[i][0]] == player && board[wins[i][1]] == player && board[wins[i][2]] == player) {
      winCombo = wins[i];
      return true;
    }
  }
  return false;
}

function miniMax(newBoard, player){
  var availableSpots = spacesLeft(newBoard);
  if (availableSpots.length === 9){
    var move = {index:1};
    return move;
  }
  if (winner(humanPlayer, newBoard)) { return {score:-10}; }
  else if (winner(computerPlayer, newBoard)) { return {score:10}; }
  else if (availableSpots.length === 0) { return {score:0}; }
  
  var moves = [];
  
  for (i = 0; i < availableSpots.length; i++){
    var move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;
    
    if (player === computerPlayer){
      var result = miniMax(newBoard, humanPlayer);
      move.score = result.score;
    }
    else {
      var result = miniMax(newBoard, computerPlayer);
      move.score = result.score;
    }
    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }
  
  var bestMove;
  if (player === computerPlayer){
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++){
      if (moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++){
      if (moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function idiotAI(currentBoard){
  var availableSpots = spacesLeft(currentBoard);
  return availableSpots[Math.floor(Math.random() * availableSpots.length)];
}

function computerMove(){
  var move = AILevel === 2 ? miniMax(mainBoard, computerPlayer).index : idiotAI(mainBoard);
  mainBoard[move] = computerPlayer;
  $("#" + move).html("<span>"+computerPlayer+"</span>");
  $("#" + move).find("span").animate({opacity:1});
  return;
}

function newGame() {
  mainBoard = [null,1,2,3,4,5,6,7,8,9];
  winCombo = [];
  won = false;
  $(".cell").empty();
  $(".cell").removeClass("winCell");
  $(".cell").removeClass("tieCell");  
  goesFirst = goesFirst === "X" ? "O" : "X";
  if (goesFirst === computerPlayer){
    computerMove();
  }
}

function win(message){
  won = true;
  $("#message").html(message);
  $("#endOpts").css('visibility','visible');
  if (message === "TIE") {
    $(".cell").addClass("tieCell");
  }
  else {
    for (var i = 0; i < winCombo.length; i++){
      $("#" + winCombo[i]).addClass("winCell");
    }
  }
}

function reset() {
  goesFirst = "O"; // Backwards as it gets switched in the new game function
  $("#board").css('visibility','hidden');
  $(".markerChoice").css('visibility','visible');
  $("#endOpts").css('visibility','hidden');
}