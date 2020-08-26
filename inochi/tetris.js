var SCREEN_W = 300, //スクリーンの横幅
  SCREEN_H = 600; //スクリーンの縦幅
var COLS = 10, //横幅を何分割するか
  ROWS = 20; //縦幅を何分割するか
var BLOCK_W = SCREEN_W / COLS, //ブロックの横幅
  BLOCK_H = SCREEN_H / ROWS; //ブロックの縦幅
var canvas = document.getElementById('field');
var ctx = canvas.getContext('2d');
var points = 0; //ポイント
var current_mino;
var current_x = 3,
  current_y = 0;
var field = [];
var tetris;
var gameover = false; //gameoverかどうか判定
var speed = 1000; //テトリスの落ちる速度１

var canvas2 = document.getElementById('sidebar');
var ctx2 = canvas2.getContext('2d');

const INOCHI_IMAGES = [];
// var canvas3 = document.getElementById('sidebar2');
// var ctx3 = canvas2.getContext('2d');

for (INOCHI of INOCHIS) {
  // 画像読み込みは、それなりに重い処理なので、メモリ上にキャッシュしておく
  var img = new Image();
  img.src = INOCHI;
  INOCHI_IMAGES.push(img);
}

for (var y = 0; y < ROWS; y++) {
  field[y] = [];
  for (var x = 0; x < COLS; x++) {
    field[y][x] = 0;
  }
}

current_mino = newMino();
tetris = setInterval(tick, speed);
render();

function render() {
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_H);
  ctx2.font = '48px serif';
  ctx2.textAlign = 'center';
  ctx2.fillText(points, 150, 120);
  for (var y = 0; y < ROWS; y++) {
    for (var x = 0; x < COLS; x++) {
      drawBlock(x, y, field[y][x]);
    }
  }
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      drawBlock(current_x + x, current_y + y, current_mino[y][x]);
    }
  }
}

function drawBlock(x, y, block) {
  if (!block) return;

  // 読み込んだ画像オブジェクトを使って描画
  ctx.drawImage(
    INOCHI_IMAGES[block - 1],
    x * BLOCK_W,
    y * BLOCK_H,
    BLOCK_W,
    BLOCK_H
  );
}

function tick() {
  if (canMove(0, 1)) {
    current_y++;
  } else {
    fix();
    clearRows();
    current_mino = newMino();
    current_x = 3;
    current_y = 0;
    gameOver();
  }
  if (!gameover) {
    render();
  }
}

function fix() {
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (current_mino[y][x]) {
        field[current_y + y][current_x + x] = current_mino[y][x];
      }
    }
  }
}

function canMove(move_x, move_y, move_mino) {
  var next_x = current_x + move_x;
  var next_y = current_y + move_y;
  var next_mino = move_mino || current_mino;
  for (var y = 0; y < 4; y++) {
    for (var x = 0; x < 4; x++) {
      if (next_mino[y][x]) {
        if (
          next_y + y >= ROWS ||
          next_x + x < 0 ||
          next_x + x >= COLS ||
          field[next_y + y][next_x + x]
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function clearRows() {
  for (var y = ROWS - 1; y >= 0; y--) {
    var fill = true;
    for (var x = 0; x < COLS; x++) {
      if (field[y][x] == 0) {
        fill = false;
        break;
      }
    }
    if (fill) {
      for (var v = y - 1; v >= 0; v--) {
        for (var x = 0; x < COLS; x++) {
          field[v + 1][x] = field[v][x];
        }
      }
      y++;
      ctx2.clearRect(0, 0, SCREEN_W, SCREEN_H);
      points++;
      clearInterval(tick, speed);
      speed = speed - 50;
      tetris = setInterval(tick, speed);
    }
  }
}

function gameOver() {
  if (
    field[0][3] >= 1 ||
    field[0][4] >= 1 ||
    field[0][5] >= 1 ||
    field[0][6] >= 1
  ) {
    clearInterval(tetris);
    ctx.font = '48px serif';
    ctx.textBaseline = 'hanging';
    ctx.strokeText('GAME OVER', 0, 300);
    gameover = true;
  }
}

document.body.onkeydown = function (e) {
  switch (e.keyCode) {
    case 37:
      if (canMove(-1, 0)) {
        current_x--;
      }
      break;
    case 39:
      if (canMove(1, 0)) {
        current_x++;
      }
      break;
    case 40:
      if (canMove(0, 1) && !gameover) {
        current_y++;
      }
      break;
    case 38:
      rotated = rotate(current_mino);
      if (canMove(0, 0, rotated)) {
        current_mino = rotated;
      }
      break;
  }
  render();
};
