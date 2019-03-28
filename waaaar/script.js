const RED = "RED";
const GREEN = "GREEN";
const BLUE = "BLUE";
const EDGE_FOR_MULTIPLYING = 30;
const LIFE_TRANSMITION = 15;

var colorOption = document.getElementById("color");
var tempratureOption = document.getElementById("temprature");

var grid;
var cols;
var rows;
var resolution = 10;
var cells;

var gameStarted = false;
function startGame(){
  gameStarted = true;
}
function save(){
  var colorOption = document.getElementById("color");
  var tempratureOption = document.getElementById("temprature");
  
}
var counter = {
  green: 0,
  blue: 0,
  red: 0
}

function drawCell(x, y, color) {
  push();
  fill(color == "RED" ? 255 : 0, color == "GREEN" ? 255 : 0, color == "BLUE" ? 255 : 0);
  rect(x, y, resolution, resolution);
  pop();
}

class Cell {
  health = 100;
  color = "NONE"
  isAlive = false;
  dmg = 1;
  startDmgMultiplier = 1;
  dmgMultiplier = 1;

  getDamage() {
    if (this.color == "RED" && tempratureOption[tempratureOption.selectedIndex].value == "HOT") { this.dmgMultiplier = 3; }
    if (this.color == "RED" && tempratureOption[tempratureOption.selectedIndex].value == "WARM") { this.dmgMultiplier = 2; }
    if (this.color == "RED" && tempratureOption[tempratureOption.selectedIndex].value == "COLD") { this.dmgMultiplier = 1; }

    if (this.color == "BLUE" && tempratureOption[tempratureOption.selectedIndex].value == "HOT") { this.dmgMultiplier = 1; }
    if (this.color == "BLUE" && tempratureOption[tempratureOption.selectedIndex].value == "WARM") { this.dmgMultiplier = 2; }
    if (this.color == "BLUE" && tempratureOption[tempratureOption.selectedIndex].value == "COLD") { this.dmgMultiplier = 3; }

    if (this.color == "GREEN" && tempratureOption[tempratureOption.selectedIndex].value == "HOT") { this.dmgMultiplier = 1; }
    if (this.color == "GREEN" && tempratureOption[tempratureOption.selectedIndex].value == "WARM") { this.dmgMultiplier = 2; }
    if (this.color == "GREEN" && tempratureOption[tempratureOption.selectedIndex].value == "COLD") { this.dmgMultiplier = 1; }

    this.health -= this.dmg;
  }

  createNew(health, color) {
    this.color = color;
    this.health = health;
    this.isAlive = true;
  }

  update() {
    if (this.health <= 0) {
      this.isAlive = false;
      return false;
    }

    if (this.isAlive) {
      this.getDamage();
      if (this.health % EDGE_FOR_MULTIPLYING == 0) {
        return true
      }

    }
    return false;
  }

  absorbCell(cell) {
    let amountOfCells;
    switch (cell.color) {
      case "GREEN":
        amountOfCells = counter.green;
        break;
      case "BLUE":
        amountOfCells = counter.blue;
        break;
      case "RED":
        amountOfCells = counter.red;
        break;
    }

    this.health += this.color == cell.color ? cell.health : -cell.health * cell.dmgMultiplier * (cells.length * cells[0].length / amountOfCells);

  }

  draw(i, j) {
    if (this.isAlive) { drawCell(i * resolution, j * resolution, this.color); }
  }
}



function setup() {
  createCanvas(600, 400);
  cols = width / resolution;
  rows = height / resolution;
  initCells();
}

function draw() {
  background(155);
  drawGrid();
  if(gameStarted){
    drawAndUpdateCells();
  }
}

function drawGrid() {
  for (let i = 0; i < rows; i++) {
    line(0, i * resolution, width, i * resolution);
  }

  for (let i = 0; i < cols; i++) {
    line(i * resolution, 0, i * resolution, height);
  }
}
function getSelctedColor() {
  return colorOption[colorOption.selectedIndex].value;
}
function mouseClicked() {
  let i = Math.floor(mouseX / resolution);
  let j = Math.floor(mouseY / resolution);
  if (mouseX < width && mouseY < height && mouseX >= 0 && mouseY >= 0) {
    cells[i][j].color = getSelctedColor();
    cells[i][j].isAlive = true;
  }
}

function initCells() {
  cells = new Array(cols);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = new Array(rows);
  }

  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      cells[i][j] = new Cell();
    }
  }
}

function drawAndUpdateCells() {
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      switch (cells[i][j].color) {
        case "GREEN":
          counter.green++;
          break;
        case "BLUE":
          counter.blue++;
          break;
        case "RED":
          counter.red++;
          break;
      }

      if (cells[i][j].update()) {
        createInAround(i, j);
      }
      cells[i][j].draw(i, j);
    }
  }
}

function createInAround(i, j) {
  let indexI = i + Math.floor(Math.random() * 3) - 1;
  let indexJ = j + Math.floor(Math.random() * 3) - 1;

  if (indexI == -1) { indexI = Math.floor(Math.random() * 2); }
  if (indexI == cells.length - 1) { indexI = i + Math.floor(Math.random() * 2); }
  if (indexJ == -1) { indexI = Math.floor(Math.random() * 2); }
  if (indexJ == cells[0].length - 1) { indexJ = j + Math.floor(Math.random() * 2); }

  if (i > 0 && j > 0 && i < cells.length - 1 && j < cells[0].length - 1) {
    if (cells[indexI][indexJ].isAlive) {
      cells[indexI][indexJ].absorbCell(cells[i][j]);
    } else {
      cells[indexI][indexJ].createNew(100, cells[i][j].color);
    }
  }
}