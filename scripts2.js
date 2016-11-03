function GameState(gameOver, playerTurn, moveCounter, needsToBlock, needsToWin) {
  this.gameOver = gameOver;
  this.playerTurn = playerTurn;
  this.moveCounter = moveCounter;
  this.needsToBlock = needsToBlock;
  this.needsToWin = needsToWin;
}

GameState.fn.incrementMove = function () {
  GameState.moveCounter++;
}

GameState.fn.reset = function () {
  GameState.gameOver = false;
  GameState.playerTurn = 0;
  GameState.moveCounter = 0;
  GameState.blockCoords = "";
  GameState.winCoords = "";
};

function Board(center, blockCoords, winCoords, board) {
  this.center = center;
  this.blockCoords = blockCoords;
  this.winCoords = winCoords;
  this.board = board;
}

Board.fn.populateSquare = function (coordinates, playerMarker) { //populateArray
  Board.board[parseInt(coordinates.charAt(1))][parseInt(coordinates.charAt(3))] = playerMarker;
}

Board.fn.reset = function () {
  Board.board = [
                  [0,0,0],
                  [0,0,0],
                  [0,0,0] ];

Board.fn.invertCoords = function(coordinates) {
  var posX = parseInt(coordinates.charAt(1));
  var posY = parseInt(coordinates.charAt(3));
  posX -= 1; posX *= 1; posX += 1;
  posY -= 1; posY *= 1; posY += 1;
  return "r" + posX + "c" + posY;
}

Board.fn.placePlayerMarker = function(coordinates) {
    Board.populateSquare(coordinates, "x");
}

Board.fn.checkIfPopulated = function(squareClicked) {
  if (squareClicked.length === 4) {
    if (Board.board[parseInt(squareClicked.charAt(1))][parseInt(squareClicked.charAt(3))] != 0) {
      return true;
    }
    else {
      return false;
    }
  }
}
}

Board.fn.checkBlock = function(string) {
  newString = string.replace(/[0-9]/g, '');
  if (newString === "xx") {
    return true;
  } else {
    return false;
  }
}

Board.fn.checkWin = function(string) {
  newString = string.replace(/[0-9]/g, '');
  if (newString === "oo") {
    return true;
  } else {
    return false;
  }
}

Board.fn.checkVictory(string) {
  if (string === "xxx") {
    return 1;
  } else if (string === "ooo") {
    return 2;
  } else {
    return false;
  }
}

Board.fn.scanBoard = function() {
  checkHor();
  checkVert();
  checkDiag1();
  checkDiag2();
}

Board.fn.checkHor = function() {
  for (j = 0; j < 3; j++) {
    var findMarks = "";
    for (i = 0; i < 3; i++) {
      findMarks += mdArray[j][i];
    }
    if (checkWin(findMarks) === true) {
      needsToWin = true;
      winCoords = "r" + j + "c" + findMarks.indexOf("0");
    }
    if (checkBlock(findMarks) === true) {
      needsToBlock = true;
      blockCoords = "r" + j + "c" + findMarks.indexOf("0");
    }
    checkVictory(findMarks);
  }
}

Board.fn.checkVert = function() {
  for (j = 0; j < 3; j++) {
    var findMarks = "";
    for (i = 0; i < 3; i++) {
      findMarks += mdArray[i][j];
    }
    if (checkWin(findMarks) === true) {
      needsToWin = true;
      winCoords = "r" + findMarks.indexOf("0") + "c" + j;
    } if (checkBlock(findMarks) === true) {
      needsToBlock = true;
      blockCoords = "r" + findMarks.indexOf("0") + "c" + j;
    }
    checkVictory(findMarks);
  }
}

Board.fn.checkDiag1 = function() {
  var findMarks = "";
  for (j = 0; j < 3; j++) {
    var i = j;
    findMarks += mdArray[i][j];
    if (checkWin(findMarks) === true) {
      needsToWin = true;
      winCoords = "r" + findMarks.indexOf("0") + "c" + findMarks.indexOf("0");
    } if (checkBlock(findMarks) === true) {
      needsToBlock = true;
      blockCoords = "r" + findMarks.indexOf("0") + "c" + findMarks.indexOf("0");
    }
    checkVictory(findMarks);
  }
}

Board.fn.checkDiag2 = function() {
  var findMarks = "";
  for (j = 0; j < 3; j++) {
    var i = (2 - j);
    findMarks += mdArray[i][j];
    if (i === 0) {
      if (checkWin(findMarks) === true) {

        if (findMarks.indexOf("0") === 0) {
          needsToWin = true;
          winCoords = "r2c0";
        } else if (findMarks.indexOf("0") === 1) {
          needsToWin = true;
          winCoords = "r1c1";
        } else if (findMarks.indexOf("0") === 2) {
          needsToWin = true;
          winCoords = "r0c2";
        } else {
          return -1;
        }
      }
      if (checkBlock(findMarks) === true) {
          if (findMarks.indexOf("0") === 0) {
            needsToBlock = true;
            blockCoords = "r2c0";
            checkVictory(findMarks);
          } else if (findMarks.indexOf("0") === 1) {
            needsToBlock = true;
            blockCoords = "r1c1";
            checkVictory(findMarks);
          } else if (findMarks.indexOf("0") === 2) {
            needsToBlock = true;
            blockCoords = "r0c2";
            checkVictory(findMarks);
          } else {
            return -1;
          }
      }
      checkVictory(findMarks);
    }
  }
}

$(document).ready(function() {
  var myGameState = new GameState (false, 0, 0, false, false);
  var myBoard = new Board ("r1c1", "", "", ([
                  [0,0,0],
                  [0,0,0],
                  [0,0,0] ]);
  $("#play").on('click', function() {
    $("#row-min").fadeIn(600);
    $("#play").hide();
  });
  $("#reset").on('click', function() {
    myBoard.reset();
    myGameState.reset();
    $('#game-status').text("");
    $('img').hide();
    $("#reset").hide();
  });
  $(".col-md-4").on('click', function() {
    var columnClicked = this;
    var coordinates = this.id;
    if (myBoard.checkIfPopulated(coordinates) === false) {
      myBoard.placePlayerMarker(coordinates);
      myGameState.incrementMove();
      myBoard.checkBlock();
      myBoard.checkWin();
    }
